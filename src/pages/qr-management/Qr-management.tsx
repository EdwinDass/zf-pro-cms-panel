import React, { useState } from "react";
import AccessLogsScreen from "../role-management/access-logs/AccessLogsPage";
import TopBar from "../../layouts/top-bar";
import QrGeneration from "./qr-generation/qr-generation";

const Qr = () => {
    const [activeTab, setActiveTab] = useState("staff");


    const tabs = [
        { id: "qr-generation", label: "QR Generation" },
        // { id: "parent-child-mapping", label: "Parent-Child Mapping" },
        { id: "audit-logs", label: "Audit Logs" },
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
                {activeTab === "qr-generation" && <QrGeneration />}
                {/* {activeTab === "roles" && <RolesScreen />} */}
                {activeTab === "logs" && <AccessLogsScreen />}
            </div>
        </div>
    );
};

export default Qr;