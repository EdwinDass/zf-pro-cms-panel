import React, { useState } from "react";
import AccessLogsScreen from "../role-management/access-logs/AccessLogsPage";
import TopBar from "../../layouts/top-bar";
import AllTickets from "./all-tickets/all-tickets";

const Tickets = () => {
    const [activeTab, setActiveTab] = useState("all-tickets");

    const tabs = [
        { id: "all-tickets", label: "All Tickets" },
        { id: "open", label: "Open" },
        { id: "closed", label: "Closed" },
        { id: "in-progress", label: "In Progress" },
        { id: "resolved", label: "Resolved" },
        // { id: "audit-logs", label: "Audit Logs" },
    ];
    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <div className="bg-white">
                <TopBar
                    title="Tickets Management"
                    description="Manage customer support tickets and inquiries"
                    actionButton={
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                            Create Ticket
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
                {activeTab === "all-tickets" && <AllTickets />}
                {/* {activeTab === "audit-logs" && <AccessLogsScreen />} */}
            </div>
        </div>
    );
};

export default Tickets;