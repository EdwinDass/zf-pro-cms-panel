import React from "react";

interface Props {
    title?: string;
    description?: string;
    actionButton?: React.ReactNode;
    logout?: () => void;
}

const TopBar: React.FC<Props> = ({
    title = "Dashboard",
    description = "Welcome back! Here's your loyalty program overview",
    actionButton,
    logout = () => { }
}) => {
    return (
        <div className="px-6 py-4 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-primary">{title}</h1>
                <p className="text-sm text-3">{description}</p>
            </div>

            <div className="flex items-center space-x-4">

                {/* Dynamic Action Button */}
                {actionButton ? actionButton : (
                    <button
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                        id="refresh-btn"
                    >
                        <i className="fas fa-sync-alt mr-2"></i> Refresh
                    </button>
                )}

                <div className="relative">
                    <button className="p-2 text-tertiary relative" aria-label="Notifications">
                        <i className="fas fa-bell"></i>
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                </div>

                <div className="relative">
                    <button className="p-2 text-tertiary" aria-label="Settings">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>

                <button
                    id="logout-btn"
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                >
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>

            </div>
        </div>
    );
};

export default TopBar;