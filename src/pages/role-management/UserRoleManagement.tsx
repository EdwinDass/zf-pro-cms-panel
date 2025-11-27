import React, { useState } from "react";
import StaffScreen from "./staff/StaffPage";
import RolesScreen from "./roles/RolesPage";
import AccessLogsScreen from "./access-logs/AccessLogsPage";
import TopBar from "../../layouts/top-bar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShieldIcon from "@mui/icons-material/Shield";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { userLogout } from "../../services/ApiService";

const UserRoleManagement = () => {
    const [activeTab, setActiveTab] = useState("staff");
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
        { id: "staff", label: "Staff" },
        { id: "roles", label: "Roles" },
        { id: "logs", label: "Access Logs" },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <div className="bg-white">
                <TopBar
                    title="Role Management"
                    description="Manage user roles, permissions and access control"
                    actionButton={
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg">
                                <PersonAddIcon fontSize="small" />
                                Add User
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg">
                                <ShieldIcon fontSize="small" />
                                Create Role
                            </button>
                        </div>
                    }
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
                {activeTab === "staff" && <StaffScreen />}
                {activeTab === "roles" && <RolesScreen />}
                {activeTab === "logs" && <AccessLogsScreen />}
            </div>
        </div>
    );
};

export default UserRoleManagement;