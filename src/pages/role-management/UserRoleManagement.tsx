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
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <div className="bg-white">
                <TopBar
                    title="User Role Management"
                    description="Manage users, roles and settings"
                    actionButton={
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                            Create User
                        </button>
                    }
                />
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