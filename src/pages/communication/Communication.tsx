import React, { useState } from "react";
import NotificationHistory from "./notification-history/NotificationHistory";
import CampaignNotifications from "./campaign-notifications/CampaignNotifications";
import NotificationLogs from "./notification-logs/NotificationLogs";
import CreateNotificationModal from "./create-notification-modal/CreateNotificationModal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { userLogout } from "../../services/ApiService";
import TopBar from "../../layouts/top-bar";
import AddIcon from "@mui/icons-material/Add";

const Communication = () => {
    const [activeTab, setActiveTab] = useState("notification-history");
    const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await userLogout();
        } catch (err) {
            console.error("Logout API failed:", err);
        }
        dispatch(logoutUser());
        dispatch(clearTokens());
        navigate("/");
    };

    const handleCreateNotification = () => {
        setIsCreateModalOpen(true);
    };

    const tabs = [
        { id: "notification-history", label: "Notification History" },
        { id: "campaign-notifications", label: "Campaign Notifications" },
    ];

    return (
        <>
            <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
                <TopBar
                    title="Communication"
                    description="Manage notifications, campaigns, and view delivery logs"
                    actionButton={
                        <button
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={handleCreateNotification}
                        >
                            <AddIcon fontSize="small" />
                            Create Notification
                        </button>
                    }
                    hideNotificationIcon={true}
                    logout={logout}
                />

                <div>
                    <div
                        className="
                            flex gap-12 
                            border border-gray-200 
                            rounded-xl 
                            px-6 py-4 
                            ml-6 
                            mr-6
                            mt-7
                            bg-white
                        "
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSelectedNotificationId(null);
                                }}
                                className={`
                                    pb-2
                                    text-md font-semibold 
                                    tracking-wide
                                    transition-all 
                                    ${activeTab === tab.id
                                        ? "text-blue-600 border-b-4 border-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 px-8">
                    {!selectedNotificationId ? (
                        <>
                            {activeTab === "notification-history" && (
                                <NotificationHistory
                                    onSelectNotification={(id) => {
                                        setSelectedNotificationId(id);
                                    }}
                                />
                            )}
                            {activeTab === "campaign-notifications" && <CampaignNotifications />}
                        </>
                    ) : (
                        <div>
                            <button
                                onClick={() => setSelectedNotificationId(null)}
                                className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                ← Back to Notification History
                            </button>
                            <NotificationLogs notificationId={selectedNotificationId} />
                        </div>
                    )}
                </div>
            </div>

            <CreateNotificationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
};

export default Communication;