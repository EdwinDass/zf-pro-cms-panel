// Layout.tsx
import React from 'react';
import "./layout.css"
// import "tailwindcss"
interface LayoutProps {
    children: React.ReactNode;
    sidebarProps?: any;
    topBarProps?: any;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    sidebarProps,
    topBarProps,
}) => {

    return (
        <div className="min-h-screen light-theme">
            {/*<!-- Notification --> */}
            <div id="notification" className="notification"></div>

            {/*<!-- Dashboard Page --> */}
            <div className='flex'>
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
                                    <a href="#" data-page="dashboard"
                                        className="sidebar-item active flex items-center px-4 py-3 text-sm font-medium rounded-lg">
                                        <i className="fas fa-tachometer-alt mr-3"></i>
                                        Dashboard
                                    </a>

                                    {/*<!-- Masters & Configuration Section --> */}
                                    <a href="#" data-page="masters-config"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-cogs mr-3"></i>
                                        Masters & Config
                                    </a>

                                    {/*<!-- Schemes & Campaigns Section --> */}
                                    <a href="#" data-page="schemes-campaigns"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-bullhorn mr-3"></i>
                                        Schemes & Campaigns
                                    </a>

                                    {/*<!-- Advanced QR Management Section --> */}
                                    <a href="#" data-page="qr-management"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-qrcode mr-3"></i>
                                        QR Management
                                    </a>

                                    {/*<!-- Communication Console Section --> */}
                                    <a href="#" data-page="communication"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-broadcast-tower mr-3"></i>
                                        Communication
                                    </a>

                                    {/*<!-- Finance & Compliance Section --> */}
                                    <a href="#" data-page="finance-compliance"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-coins mr-3"></i>
                                        Finance & Compliance
                                    </a>

                                    {/*<!-- Fraud Detection Section --> */}
                                    <a href="#" data-page="fraud-detection"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-shield-alt mr-3"></i>
                                        Fraud Detection
                                    </a>

                                    {/*<!-- MIS & Analytics Section --> */}
                                    <a href="#" data-page="mis-analytics"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-chart-line mr-3"></i>
                                        MIS & Analytics
                                    </a>

                                    {/*<!-- Role Management Section --> */}
                                    <a href="#" data-page="role-management"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-user-shield mr-3"></i>
                                        Role Management
                                    </a>

                                    {/*<!-- Integration Monitoring Section --> */}
                                    <a href="#" data-page="integrations"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-plug mr-3"></i>
                                        Integrations
                                    </a>

                                    {/*<!-- Existing Sections --> */}
                                    <a href="#" data-page="process"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-cogs mr-3"></i>
                                        Process
                                    </a>
                                    <a href="#" data-page="tickets"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-ticket-alt mr-3"></i>
                                        Tickets
                                    </a>
                                    <a href="#" data-page="members"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-users mr-3"></i>
                                        Members
                                    </a>
                                    <a href="#" data-page="configuration"
                                        className="sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg text-secondary">
                                        <i className="fas fa-sliders-h mr-3"></i>
                                        Configuration
                                    </a>
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
                <div>
                    {children}
                </div>
            </div>

        </div>
    );
};