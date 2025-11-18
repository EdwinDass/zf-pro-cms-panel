import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./layout.css"
import TopBar from './top-bar';

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

    const navItems: NavItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/dashboard' },
        { id: 'masters-config', label: 'Masters & Config', icon: 'fas fa-cogs', path: '/masters-config' },
        { id: 'schemes-campaigns', label: 'Schemes & Campaigns', icon: 'fas fa-bullhorn', path: '/schemes-campaigns' },
        { id: 'qr-management', label: 'QR Management', icon: 'fas fa-qrcode', path: '/qr' },
        { id: 'communication', label: 'Communication', icon: 'fas fa-broadcast-tower', path: '/communication' },
        { id: 'finance-compliance', label: 'Finance & Compliance', icon: 'fas fa-coins', path: '/finance-compliance' },
        { id: 'fraud-detection', label: 'Fraud Detection', icon: 'fas fa-shield-alt', path: '/fraud-detection' },
        { id: 'mis-analytics', label: 'MIS & Analytics', icon: 'fas fa-chart-line', path: '/mis-analytics' },
        { id: 'role-management', label: 'Role Management', icon: 'fas fa-user-shield', path: '/role-management' },
        { id: 'integrations', label: 'Integrations', icon: 'fas fa-plug', path: '/integrations' },
        { id: 'process', label: 'Process', icon: 'fas fa-cogs', path: '/process' },
        { id: 'tickets', label: 'Tickets', icon: 'fas fa-ticket-alt', path: '/tickets' },
        { id: 'members', label: 'Members', icon: 'fas fa-users', path: '/members' },
        { id: 'configuration', label: 'Configuration', icon: 'fas fa-sliders-h', path: '/configuration' },
    ];

    // Navigation handler
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    // Check if current route is active
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen light-theme body-temp">
            {/*<!-- Notification --> */}
            <div id="notification" className="notification"></div>

            {/*<!-- Dashboard Page --> */}
            <div className='flex w-full'>
                <div id="dashboard-page" className="page active">
                    <div className="flex h-screen">
                        {/*<!-- Sidebar --> */}
                        <div className="sidebar w-64 flex flex-col">
                            <div className="p-6 border-b border-custom">
                                <img src="https://ik.imagekit.io/ewxcertfq/ZF_proPoints_Logo_xcept_Black_RGB%201.png?updatedAt=1760210363486"
                                    alt="ZF Logo" className="h-10 sidebar-logo" />
                            </div>
                            <div className="flex-1 overflow-y-auto py-4">
                                <nav className="px-2 space-y-1">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleNavigation(item.path)}
                                            className={`sidebar-item ${isActive(item.path) ? 'active' : ''} flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary w-full text-left`}
                                        >
                                            <i className={`${item.icon} mr-3`}></i>
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="p-4 border-t border-custom">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div
                                            className="h-10 w-10 rounded-full bg-blue-100 dark:bg-opacity-20 flex items-center justify-center">
                                            <span className="text-blue-800 dark:text-blue-400 font-medium">A</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-primary">Admin User</p>
                                        <p className="text-xs text-tertiary">admin@zf.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    {children}
                </div>
            </div>
        </div>
    );
};