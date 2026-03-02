import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    sidebarProps,
    topBarProps,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expanded, setExpanded] = useState(() => {
        const savedExpanded = sessionStorage.getItem('sidebarExpanded');
        return savedExpanded !== null ? JSON.parse(savedExpanded) : false;
    });
    const [isMobile, setIsMobile] = useState(false);

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

    const navItems: NavItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/dashboard' },
        // { id: 'masters-config', label: 'Masters & Config', icon: 'fas fa-cogs', path: '/masters-config' },
        // { id: 'schemes-campaigns', label: 'Schemes & Campaigns', icon: 'fas fa-bullhorn', path: '/schemes-campaigns' },
        { id: 'qr-management', label: 'QR Management', icon: 'fas fa-qrcode', path: '/qr' },
        // { id: 'communication', label: 'Communication', icon: 'fas fa-broadcast-tower', path: '/communication' },
        // { id: 'finance-compliance', label: 'Finance & Compliance', icon: 'fas fa-coins', path: '/finance-compliance' },
        // { id: 'fraud-detection', label: 'Fraud Detection', icon: 'fas fa-shield-alt', path: '/fraud-detection' },
        { id: 'mis-analytics', label: 'MIS & Analytics', icon: 'fas fa-chart-line', path: '/mis-analytics' },
        { id: 'role-management', label: 'Role Management', icon: 'fas fa-user-shield', path: '/role-management' },
        // { id: 'integrations', label: 'Integrations', icon: 'fas fa-plug', path: '/integrations' },
        { id: 'process', label: 'Process Redemption', icon: 'fas fa-cogs', path: '/process-management' },
        { id: 'tickets', label: 'Tickets', icon: 'fas fa-ticket-alt', path: '/tickets' },
        { id: 'members', label: 'Members and KYC', icon: 'fas fa-users', path: '/members-management' },
        // { id: 'configuration', label: 'Configuration', icon: 'fas fa-sliders-h', path: '/configuration' },
        { id: 'amazon-marketplace', label: 'Amazon Marketplace', icon: 'fas fa-store', path: '/amazon-marketplace' },
    ];

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
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.path)}
                                    aria-label={item.label}
                                    title={item.label}
                                    className={`
                                        flex items-center w-full text-left rounded-lg transition-all duration-200
                                        ${expanded ? 'px-4 py-3' : 'px-3 py-3 justify-center'}
                                        ${isActive(item.path)
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1'
                                        }
                                    `}
                                >
                                    <i className={`${item.icon} ${expanded ? 'mr-3' : ''} text-lg`}></i>
                                    {expanded && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* User Profile */}
                    {expanded && (
                        <div className="p-4 border-t border-gray-200 flex-shrink-0">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">A</span>
                                    </div>
                                </div>
                                <div className="ml-3 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                                    <p className="text-xs text-gray-500 truncate">admin@zf.com</p>
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
