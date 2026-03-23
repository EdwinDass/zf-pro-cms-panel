import React, { useState } from "react";
import NotificationHistory from "./notification-history/NotificationHistory";
import CampaignNotifications from "./campaign-notifications/CampaignNotifications";
import CampaignNotificationsList from "./campaign-notifications/CampaignNotificationsList";
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
    const [selectedCampaign, setSelectedCampaign] = useState<{ id: number; name: string } | null>(null);
    const [selectedCampaignNotificationId, setSelectedCampaignNotificationId] = useState<number | null>(null);
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

    // Determine what sub-page is active
    const isInNotificationLogs = !!selectedNotificationId;
    const isInCampaignNotifications = !!selectedCampaign;
    const isInSubPage = isInNotificationLogs || isInCampaignNotifications;

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
                                    setSelectedCampaign(null);
                                    setSelectedCampaignNotificationId(null);
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
                    {/* Notification History tab */}
                    {activeTab === "notification-history" && (
                        isInNotificationLogs ? (
                            <div>
                                <button
                                    onClick={() => setSelectedNotificationId(null)}
                                    className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Notification History
                                </button>
                                <NotificationLogs notificationId={selectedNotificationId} />
                            </div>
                        ) : (
                            <NotificationHistory
                                onSelectNotification={(id) => setSelectedNotificationId(id)}
                            />
                        )
                    )}

                    {/* Campaign Notifications tab */}
                    {activeTab === "campaign-notifications" && (
                        selectedCampaignNotificationId ? (
                            // Level 3: Notification logs for a specific campaign notification
                            <div>
                                <button
                                    onClick={() => setSelectedCampaignNotificationId(null)}
                                    className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to {selectedCampaign?.name} Notifications
                                </button>
                                <NotificationLogs notificationId={selectedCampaignNotificationId} />
                            </div>
                        ) : isInCampaignNotifications && selectedCampaign ? (
                            // Level 2: Notifications for a specific campaign
                            <div>
                                <button
                                    onClick={() => setSelectedCampaign(null)}
                                    className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Campaigns
                                </button>
                                <CampaignNotificationsList
                                    campaignId={selectedCampaign.id}
                                    campaignName={selectedCampaign.name}
                                    onSelectNotification={(id) => setSelectedCampaignNotificationId(id)}
                                />
                            </div>
                        ) : (
                            // Level 1: Campaign list
                            <CampaignNotifications
                                onSelectCampaign={(id, name) => setSelectedCampaign({ id, name })}
                            />
                        )
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