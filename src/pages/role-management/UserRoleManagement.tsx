import React, { useState } from "react";
import StaffScreen from "./staff/StaffPage";
import RolesScreen from "./roles/RolesPage";
import AccessLogsScreen from "./access-logs/AccessLogsPage";
import TopBar from "../../layouts/top-bar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { userLogout, getUserRoles, addUser } from "../../services/ApiService";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { customEncodeBase64 } from "../../utils/random";   // <-- IMPORTANT

// ROLE TYPE
type RoleType = {
    roleId: number;
    roleName: string;
    roleDescription: string;
    createdAt: string;
    isActive: boolean;
};

const UserRoleManagement = () => {
    const [activeTab, setActiveTab] = useState("staff");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState<RoleType[]>([]);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        userMobile: "",
        displayName: "",
        userRole: "",
        password: ""
    });

    const resetForm = () => {
        setFormData({
            userName: "",
            userEmail: "",
            userMobile: "",
            displayName: "",
            userRole: "",
            password: ""
        });
    };

    const fetchRolesList = async () => {
        try {
            const res = await getUserRoles();
            setRoles(res.data.data);
        } catch (err) {
            console.log("Failed to fetch roles", err);
        }
    };

    const openModal = () => {
        resetForm();
        fetchRolesList();
        setShowModal(true);
    };

    const handleSubmit = async () => {

        const encodedPassword = customEncodeBase64(formData.password, true);

        const payload = {
            userName: formData.userName,
            userEmail: formData.userEmail,
            displayName: formData.displayName,
            userMobile: formData.userMobile,
            userRole: Number(formData.userRole),
            userPassword: encodedPassword  // <-- ENCODED
        };

        try {
            const res = await addUser(payload);

            if (res.data?.code !== 200 && res.data?.code !== 201) {
                toast.error(res.data?.message || "Something went wrong");
                return;
            }

            toast.success(res.data?.message || "User added successfully 👍", { theme: "colored" });

            setTimeout(() => {
                resetForm();
                setShowModal(false);
            }, 800);

        } catch (err: any) {
            const msg = err?.response?.data?.message ?? "Something went wrong";
            toast.error(msg);
        }
    };

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
        { id: "logs", label: "Access Logs" },
    ];

    return (
        <>
            <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
                <TopBar
                    title="Role Management"
                    description="Manage user roles, permissions and access control"
                    actionButton={
                        <button
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={openModal}
                        >
                            <PersonAddIcon fontSize="small" />
                            Add User
                        </button>
                    }
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

                <div className="mt-6 px-8">
                    {activeTab === "staff" && <StaffScreen />}
                    {activeTab === "roles" && <RolesScreen />}
                    {activeTab === "logs" && <AccessLogsScreen />}
                </div>

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-2xl w-[650px] shadow-2xl border border-gray-200">

                            {/* 🔵 TITLE FIXED TO BLUE */}
                            <h2 className="text-3xl font-semibold mb-6 text-blue-600 flex items-center gap-3">
                                <PersonAddIcon fontSize="large" className="text-blue-600" />
                                Add New User
                            </h2>

                            <div className="grid grid-cols-2 gap-6">

                                <div className="relative">
                                    <PersonIcon className="absolute left-3 top-4 text-gray-500 text-lg" />
                                    <input
                                        type="text"
                                        placeholder="User Name"
                                        className="border pl-11 p-3 rounded-xl w-full text-[15px]"
                                        value={formData.userName}
                                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    />
                                </div>

                                <div className="relative">
                                    <EmailIcon className="absolute left-3 top-4 text-gray-500 text-lg" />
                                    <input
                                        type="email"
                                        placeholder="User Email"
                                        className="border pl-11 p-3 rounded-xl w-full text-[15px]"
                                        value={formData.userEmail}
                                        onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                                    />
                                </div>

                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-4 text-gray-500 text-lg" />
                                    <input
                                        type="text"
                                        placeholder="User Mobile"
                                        className="border pl-11 p-3 rounded-xl w-full text-[15px]"
                                        value={formData.userMobile}
                                        onChange={(e) => setFormData({ ...formData, userMobile: e.target.value })}
                                    />
                                </div>

                                <div className="relative">
                                    <BadgeIcon className="absolute left-3 top-4 text-gray-500 text-lg" />
                                    <input
                                        type="text"
                                        placeholder="Display Name"
                                        className="border pl-11 p-3 rounded-xl w-full text-[15px]"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    />
                                </div>

                                <div className="relative">
                                    <PersonIcon className="absolute left-3 top-4 text-gray-500 text-lg" />
                                    <select
                                        aria-label="User Role"
                                        className="border pl-11 p-3 rounded-xl w-full text-[15px]"
                                        value={formData.userRole}
                                        onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map((role) => (
                                            <option key={role.roleId} value={role.roleId}>
                                                {role.roleName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <LockIcon className="absolute left-3 top-4 text-gray-500 text-lg" />

                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Password"
                                        className="border pl-11 pr-11 p-3 rounded-xl w-full text-[15px]"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />

                                    <div
                                        className="absolute right-3 top-3.5 cursor-pointer text-gray-600"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                                    </div>
                                </div>

                            </div>

                            <div className="flex justify-end gap-4 mt-10">
                                <button
                                    className="px-5 py-3 bg-gray-300 text-[15px] rounded-xl hover:bg-gray-400 transition"
                                    onClick={() => {
                                        resetForm();
                                        setShowModal(false);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-5 py-3 bg-blue-600 text-white text-[15px] rounded-xl hover:bg-blue-700 transition"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserRoleManagement;