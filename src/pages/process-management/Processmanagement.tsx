import React, { useState } from "react";
import TopBar from "../../layouts/top-bar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShieldIcon from "@mui/icons-material/Shield";
import ProcessRedemption from "./process-redemption/ProcessRedemption";
import RedemptionRequests from "./redemption-requests/RedemptionRequests";
import ManualEntry from "./manual-entry/ManualEntry";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../../services/ApiService";

const ProcessManagement = () => {
    const [activeTab, setActiveTab] = useState("ProcessRedemption");
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

    const tabs = [
        { id: "ProcessRedemption", label: "Process Redemption" },
        // { id: "RedemptionRequests", label: "Redemption Requests" },
        // { id: "ManualEntry", label: "Manual Entry" },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <div className="bg-white">
                <TopBar
                    title="Process Management"
                    description="Approve/Reject redemption requests"
                    logout={logout}
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

            {/* CONTENT SECTION */}
            <div className="mt-6 px-8">
                {activeTab === "ProcessRedemption" && <ProcessRedemption />}
                {/* {activeTab === "RedemptionRequests" && <RedemptionRequests />} */}
                {activeTab === "ManualEntry" && <ManualEntry />}
            </div>
        </div>
    );
};

export default ProcessManagement;