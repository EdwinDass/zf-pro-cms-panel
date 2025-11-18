import React, { useState } from "react";
import StaffScreen from "./staff/StaffPage";
import RolesScreen from "./roles/RolesPage";
import AccessLogsScreen from "./access-logs/AccessLogsPage";
import TopBar from "../../layouts/top-bar";

const UserRoleManagement = () => {
    const [activeTab, setActiveTab] = useState("staff");

    const tabs = [
        { id: "staff", label: "Staff" },
        { id: "roles", label: "Roles" },
        { id: "logs", label: "Access Logs" },
    ];

    return (
        <div className="w-full min-h-screen bg-gray-100">
            <div className="bg-white">
                <TopBar />
            </div>

            {/* TABS SECTION */}
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
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                pb-4 
                                text-lg font-semibold 
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

            {/* CONTENT SECTION */}
            <div className="mt-8 px-6">
                {activeTab === "staff" && <StaffScreen />}
                {activeTab === "roles" && <RolesScreen />}
                {activeTab === "logs" && <AccessLogsScreen />}
            </div>
        </div>
    );
};

export default UserRoleManagement;