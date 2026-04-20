import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { getAllowedModules } from '../values/roleModuleRules';

interface LayoutProps {
    children: React.ReactNode;
    sidebarProps?: any;
    topBarProps?: any;
}

interface NavItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    subItems?: { id: string; label: string; path: string; }[];
}

export const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/dashboard' },
    // { id: 'masters-config', label: 'Masters & Config', icon: 'fas fa-cogs', path: '/masters-config' },
    // { id: 'schemes-campaigns', label: 'Schemes & Campaigns', icon: 'fas fa-bullhorn', path: '/schemes-campaigns' },
    { id: 'qr-management', label: 'QR Management', icon: 'fas fa-qrcode', path: '/qr' },
    { id: 'communication', label: 'Communication', icon: 'fas fa-broadcast-tower', path: '/communication' },
    // { id: 'finance-compliance', label: 'Finance & Compliance', icon: 'fas fa-coins', path: '/finance-compliance' },
    // { id: 'fraud-detection', label: 'Fraud Detection', icon: 'fas fa-shield-alt', path: '/fraud-detection' },
    { id: 'mis-analytics', label: 'MIS & Analytics', icon: 'fas fa-chart-line', path: '/mis-analytics' },
    { id: 'role-management', label: 'Role Management', icon: 'fas fa-user-shield', path: '/role-management' },
    // { id: 'integrations', label: 'Integrations', icon: 'fas fa-plug', path: '/integrations' },
    { id: 'process', label: 'Process Redemption', icon: 'fas fa-cogs', path: '/process-management' },
    { id: 'tickets', label: 'Tickets', icon: 'fas fa-ticket-alt', path: '/tickets' },
    { id: 'members', label: 'Members and KYC', icon: 'fas fa-users', path: '/members-management' },
    { id: 'faqs', label: 'FAQs', icon: 'fas fa-question-circle', path: '/faqs' },
    { id: 'assets', label: 'Assets', icon: 'fas fa-folder-open', path: '/assets-management' },
    // { id: 'configuration', label: 'Configuration', icon: 'fas fa-sliders-h', path: '/configuration' },
    { id: 'amazon-marketplace', label: 'Amazon Marketplace', icon: 'fas fa-store', path: '/amazon-marketplace' },
    {
        id: 'surveys',
        label: 'Survey Module',
        icon: 'fas fa-poll',
        path: '',
        subItems: [
            { id: 'survey-questions', label: 'Survey Questions', path: '/survey-questions' },
            { id: 'survey-responses', label: 'Survey Responses', path: '/survey-responses' }
        ]
    },
    { id: 'sku-management', label: 'SKU Management', icon: 'fas fa-boxes', path: '/categories' },
];

export const Layout: React.FC<LayoutProps> = ({
    children,
    sidebarProps,
    topBarProps,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAppSelector((state) => state.user.userData);
    const [expanded, setExpanded] = useState(() => {
        const savedExpanded = sessionStorage.getItem('sidebarExpanded');
        return savedExpanded !== null ? JSON.parse(savedExpanded) : false;
    });
    const [isMobile, setIsMobile] = useState(false);
    const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
    const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);

    const roleMap: Record<string, string> = {
        "1": "mechanic",
        "2": "regional_manager",
        "3": "call_centre_executive",
        "4": "marketing_manager",
        "5": "operator",
        "6": "viewer",
        "7": "qr_admin",
        "8": "evolve_admin",
        "9": "client_admin"
    };

    const formatRoleLabel = (raw: string) =>
        raw
            .split(/[_\s]+/)
            .filter(Boolean)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");

    const roleIdKey =
        user?.userRoleId !== undefined && user?.userRoleId !== null && String(user.userRoleId) !== ""
            ? String(user.userRoleId)
            : "";

    const roleLabel = user
        ? (user.userRole ||
            (user as any).roleName ||
            (roleIdKey ? roleMap[roleIdKey] : "") ||
            user.userSubRole ||
            (user as any).subRoleName ||
            "")
        : "";

    const displayRole = roleLabel ? formatRoleLabel(roleLabel) : "";

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 992);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setExpanded(false);
        }
    }, [isMobile]);

    useEffect(() => {
        sessionStorage.setItem('sidebarExpanded', JSON.stringify(expanded));
    }, [expanded]);

    // Filter navigation items based on user role
    useEffect(() => {
        const userRoleId = user?.userRoleId;
        const allowedModules = getAllowedModules(userRoleId);

        const filtered = navItems.filter(item => {
            // Check if item's module is allowed
            if (allowedModules.includes(item.id)) {
                return true;
            }
            // For items with subItems, check if any subItems are in allowed modules
            if (item.subItems && item.subItems.length > 0) {
                const hasAllowedSubItem = item.subItems.some(subItem => allowedModules.includes(subItem.id));
                return hasAllowedSubItem;
            }
            return false;
        }).map(item => {
            // Filter subItems if they exist
            if (item.subItems && item.subItems.length > 0) {
                return {
                    ...item,
                    subItems: item.subItems.filter(subItem => allowedModules.includes(subItem.id))
                };
            }
            return item;
        });

        setFilteredNavItems(filtered);
    }, [user?.userRoleId]);

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            setExpanded(false);
        }
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Overlay for mobile */}
            {isMobile && expanded && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setExpanded(false)}
                    aria-label="Close sidebar overlay"
                />
            )}

            {/* Mobile Hamburger Button */}
            {isMobile && !expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                    aria-label="Open sidebar"
                    title="Open sidebar"
                >
                    <i className="fas fa-bars text-xl"></i>
                </button>
            )}

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div
                    className={`
                        fixed top-0 h-screen bg-white shadow-xl z-50 transition-all duration-300 ease-in-out flex flex-col
                        ${isMobile
                            ? expanded
                                ? 'left-0 w-4/5 max-w-xs'
                                : '-left-full w-0'
                            : expanded
                                ? 'left-0 w-64'
                                : 'left-0 w-16'
                        }
                    `}
                >
                    {/* Logo Section */}
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                        {expanded && (
                            <img
                                src="https://ik.imagekit.io/ewxcertfq/ZF_proPoints_Logo_xcept_Black_RGB%201.png?updatedAt=1760210363486"
                                alt="ZF Logo"
                                className="h-10"
                            />
                        )}

                        {/* Desktop Collapse Button */}
                        {!isMobile && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-gray-600 hover:text-gray-900 transition-colors ml-auto"
                                aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                                title={expanded ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                <i className={`fas ${expanded ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                            </button>
                        )}

                        {/* Mobile Close Button */}
                        {isMobile && (
                            <button
                                onClick={() => setExpanded(false)}
                                className="text-gray-600 hover:text-gray-900 transition-colors ml-auto"
                                aria-label="Close sidebar"
                                title="Close sidebar"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="px-2 space-y-1">
                            {filteredNavItems.map((item) => (
                                <div key={item.id}>
                                    <button
                                        onClick={() => {
                                            if (item.subItems) {
                                                setOpenSubMenus(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                                if (!expanded && !isMobile) setExpanded(true);
                                            } else {
                                                handleNavigation(item.path);
                                            }
                                        }}
                                        aria-label={item.label}
                                        title={item.label}
                                        className={`
                                            flex items-center w-full text-left rounded-lg transition-all duration-200
                                            ${expanded ? 'px-4 py-3' : 'px-3 py-3 justify-center'}
                                            ${(isActive(item.path) || (item.subItems && item.subItems.some(sub => isActive(sub.path))))
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1'
                                            }
                                        `}
                                    >
                                        <i className={`${item.icon} ${expanded ? 'mr-3' : ''} text-lg`}></i>
                                        {expanded && <span className="text-sm whitespace-nowrap flex-1">{item.label}</span>}
                                        {expanded && item.subItems && (
                                            <i className={`fas fa-chevron-${openSubMenus[item.id] ? 'up' : 'down'} text-xs ml-2`}></i>
                                        )}
                                    </button>

                                    {item.subItems && expanded && openSubMenus[item.id] && (
                                        <div className="pl-10 pr-2 mt-1 space-y-1">
                                            {item.subItems.map((sub: any) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => handleNavigation(sub.path)}
                                                    className={`
                                                        w-full text-left px-4 py-2 text-sm rounded-lg transition-colors
                                                        ${isActive(sub.path) ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                                                    `}
                                                >
                                                    {sub.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* User Profile */}
                    {expanded && (
                        <div className="p-4 border-t border-gray-200 flex-shrink-0">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">
                                            {(displayRole || "-").charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {displayRole || "-"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.userEmail || "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div
                    className={`
                        flex-1 transition-all duration-300 ease-in-out
                        ${isMobile
                            ? 'ml-0'
                            : expanded
                                ? 'ml-64'
                                : 'ml-16'
                        }
                    `}
                >
                    <div className="w-full min-h-screen">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
