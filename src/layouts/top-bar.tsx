import React, { useState } from "react";

interface Props {
    title?: string;
    description?: string;
    actionButton?: React.ReactNode;
    logout?: () => void;
    hideNotificationIcon?: boolean;
}

const TopBar: React.FC<Props> = ({
    title = "Dashboard",
    description = "Welcome back! Here's your loyalty program overview",
    actionButton,
    logout = () => { },
    hideNotificationIcon = false
}) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <>
            {/* Desktop TopBar */}
            <div className="hidden lg:flex px-6 py-4 items-center justify-between bg-white shadow-sm">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>
                    <p className="text-sm text-gray-600 truncate">{description}</p>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0">

                    {/* Dynamic Action Button */}
                    {actionButton ? actionButton : (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                            id="refresh-btn"
                            aria-label="Refresh data"
                            title="Refresh data"
                        >
                            <i className="fas fa-sync-alt mr-2"></i> Refresh
                        </button>
                    )}

                    {!hideNotificationIcon && (
                        <div className="relative">
                            <button
                                className="p-2 text-gray-600 hover:text-gray-900 relative"
                                aria-label="View notifications"
                                title="View notifications"
                            >
                                <i className="fas fa-bell text-lg"></i>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </button>
                        </div>
                    )}

                    <div className="relative">
                        <button
                            className="p-2 text-gray-600 hover:text-gray-900"
                            aria-label="Open settings"
                            title="Open settings"
                        >
                            <i className="fas fa-cog text-lg"></i>
                        </button>
                    </div>

                    <button
                        id="logout-btn"
                        onClick={logout}
                        aria-label="Logout"
                        title="Logout"
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                    >
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                </div>
            </div>

            {/* Tablet TopBar */}
            <div className="hidden md:flex lg:hidden px-4 py-3 items-center justify-between bg-white shadow-sm">
                <div className="flex-1 min-w-0 mr-4">
                    <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
                    <p className="text-xs text-gray-600 truncate">{description}</p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                    {actionButton ? actionButton : (
                        <button
                            className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                            id="refresh-btn-tablet"
                            aria-label="Refresh data"
                            title="Refresh data"
                        >
                            <i className="fas fa-sync-alt"></i>
                        </button>
                    )}

                    {!hideNotificationIcon && (
                        <div className="relative">
                            <button
                                className="p-2 text-gray-600 hover:text-gray-900 relative"
                                aria-label="View notifications"
                                title="View notifications"
                            >
                                <i className="fas fa-bell"></i>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </button>
                        </div>
                    )}

                    <div className="relative">
                        <button
                            className="p-2 text-gray-600 hover:text-gray-900"
                            aria-label="Open settings"
                            title="Open settings"
                        >
                            <i className="fas fa-cog"></i>
                        </button>
                    </div>

                    <button
                        id="logout-btn-tablet"
                        onClick={logout}
                        aria-label="Logout"
                        title="Logout"
                        className="px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>

            {/* Mobile TopBar */}
            <div className="md:hidden bg-white shadow-sm">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                        <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
                        <p className="text-xs text-gray-600 truncate">{description}</p>
                    </div>

                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="p-2 text-gray-600 hover:text-gray-900 flex-shrink-0"
                        aria-label="Open menu"
                        title="Menu options"
                    >
                        <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-ellipsis-v'} text-lg`}></i>
                    </button>
                </div>

                {showMobileMenu && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="space-y-2">

                            {actionButton ? (
                                <div className="w-full">{actionButton}</div>
                            ) : (
                                <button
                                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                                    id="refresh-btn-mobile"
                                    aria-label="Refresh data"
                                    title="Refresh data"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <i className="fas fa-sync-alt mr-2"></i> Refresh
                                </button>
                            )}

                            {!hideNotificationIcon && (
                                <button
                                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                                    aria-label="View notifications"
                                    title="View notifications"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <i className="fas fa-bell mr-2"></i> Notifications
                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                                </button>
                            )}

                            <button
                                className="w-full px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                                aria-label="Open settings"
                                title="Open settings"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <i className="fas fa-cog mr-2"></i> Settings
                            </button>

                            <button
                                id="logout-btn-mobile"
                                onClick={() => {
                                    setShowMobileMenu(false);
                                    logout();
                                }}
                                aria-label="Logout"
                                title="Logout"
                                className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                            >
                                <i className="fas fa-sign-out-alt mr-2"></i> Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TopBar;
