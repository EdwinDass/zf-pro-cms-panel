import React, { useState } from "react";
import TopBar from "../../layouts/top-bar";

import Reports from "./reports/Reports";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ExecutiveDashboard = () => <div>Executive Dashboard Content</div>;
const PerformanceMetrics = () => <div>Performance Metrics Content</div>;
const MemberAnalytics = () => <div>Member Analytics Content</div>;
const CampaignAnalytics = () => <div>Campaign Analytics Content</div>;

const MisAnalytics = () => {
    const [activeTab, setActiveTab] = useState("Reports");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        dispatch(logoutUser());
        dispatch(clearTokens());
        navigate("/");
    };

    const tabs = [
        // { id: "ExecutiveDashboard", label: "Executive Dashboard" },
        // { id: "PerformanceMetrics", label: "Performance Metrics" },
        // { id: "MemberAnalytics", label: "Member Analytics" },
        // { id: "CampaignAnalytics", label: "Campaign Analytics" },
        { id: "Reports", label: "Reports" },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <div className="bg-white">
                <TopBar
                    title="MIS Analytics"
                    description="Advanced analytics and insights dashboard"
                    logout={logout}
                />
            </div>

            {/* TABS */}
            <div className="flex gap-12 border border-gray-200 rounded-xl px-6 py-4 ml-6 mr-6 mt-7 bg-white">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            pb-2 text-md font-semibold tracking-wide transition-all 
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

            {/* CONTENT SECTION */}
            <div className="mt-6 px-8">
                {activeTab === "ExecutiveDashboard" && <ExecutiveDashboard />}
                {activeTab === "PerformanceMetrics" && <PerformanceMetrics />}
                {activeTab === "MemberAnalytics" && <MemberAnalytics />}
                {activeTab === "CampaignAnalytics" && <CampaignAnalytics />}
                {activeTab === "Reports" && <Reports />}
            </div>
        </div>
    );
};

export default MisAnalytics;