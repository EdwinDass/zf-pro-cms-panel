import React, { useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CustomTable, { Column } from "../../../components/CustomTable";

type UserRole = "Admin" | "Manager" | "Operator" | "Viewer";
type UserStatus = "active" | "inactive" | "pending";

interface User {
    id: string;
    name: string;
    initials: string;
    email: string;
    role: UserRole;
    department: string;
    lastLogin: string;
    status: UserStatus;
    color: string;
}

const StaffScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const users: User[] = [
        {
            id: "USR001",
            name: "John Doe",
            initials: "JD",
            email: "john.doe@zf.com",
            role: "Admin",
            department: "IT",
            lastLogin: "Oct 25, 2023 10:30 AM",
            status: "active",
            color: "bg-blue-500",
        },
        {
            id: "USR002",
            name: "Alice Smith",
            initials: "AS",
            email: "alice.smith@zf.com",
            role: "Manager",
            department: "Sales",
            lastLogin: "Oct 25, 2023 09:15 AM",
            status: "active",
            color: "bg-green-500",
        },
        {
            id: "USR003",
            name: "Robert Johnson",
            initials: "RJ",
            email: "robert.johnson@zf.com",
            role: "Operator",
            department: "Operations",
            lastLogin: "Oct 24, 2023 04:45 PM",
            status: "active",
            color: "bg-purple-500",
        },
        {
            id: "USR004",
            name: "Emma Wilson",
            initials: "EW",
            email: "emma.wilson@zf.com",
            role: "Viewer",
            department: "Marketing",
            lastLogin: "Oct 23, 2023 02:30 PM",
            status: "pending",
            color: "bg-orange-500",
        },
        {
            id: "USR005",
            name: "Michael Brown",
            initials: "MB",
            email: "michael.brown@zf.com",
            role: "Manager",
            department: "Finance",
            lastLogin: "Oct 22, 2023 11:20 AM",
            status: "inactive",
            color: "bg-blue-500",
        },
    ];

    const getBadgeColor = (role: UserRole): string => {
        const colors: Record<UserRole, string> = {
            Admin: "bg-blue-100 text-blue-600",
            Manager: "bg-green-100 text-green-600",
            Operator: "bg-orange-100 text-orange-600",
            Viewer: "bg-gray-100 text-gray-600",
        };
        return colors[role];
    };

    const getStatusIndicator = (status: UserStatus): string => {
        const colors: Record<UserStatus, string> = {
            active: "bg-green-500",
            inactive: "bg-red-500",
            pending: "bg-orange-500",
        };
        return colors[status];
    };

    const getStatusText = (status: UserStatus): string => {
        const colors: Record<UserStatus, string> = {
            active: "text-green-600",
            inactive: "text-red-600",
            pending: "text-orange-600",
        };
        return colors[status];
    };

    const columns: Column[] = [
        {
            key: "user",
            label: "User",
            render: (user: User) => (
                <div className="flex items-center">
                    <div
                        className={`w-10 h-10 rounded-full ${user.color} flex justify-center items-center text-white font-semibold`}
                    >
                        {user.initials}
                    </div>
                    <div className="ml-3">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">User ID: {user.id}</div>
                    </div>
                </div>
            ),
        },
        { key: "email", label: "Email" },
        {
            key: "role",
            label: "Role",
            render: (u: User) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                        u.role
                    )}`}
                >
                    {u.role}
                </span>
            ),
        },
        { key: "department", label: "Department" },
        { key: "lastLogin", label: "Last Login" },
        {
            key: "status",
            label: "Status",
            render: (u: User) => (
                <div className="flex items-center">
                    <span
                        className={`w-2 h-2 rounded-full ${getStatusIndicator(
                            u.status
                        )} mr-2`}
                    />
                    <span className={`capitalize ${getStatusText(u.status)}`}>
                        {u.status}
                    </span>
                </div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (u: User) => (
                <div className="flex items-center space-x-4">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <EditIcon fontSize="small" className="mr-1" /> Edit
                    </button>
                    <button className="text-green-600 hover:text-green-900 flex items-center">
                        <SettingsIcon fontSize="small" className="mr-1" /> Permissions
                    </button>
                    <button
                        className={`flex items-center ${u.status === "inactive"
                                ? "text-green-600 hover:text-green-900"
                                : "text-red-600 hover:text-red-900"
                            }`}
                    >
                        {u.status === "inactive" ? (
                            <>
                                <ToggleOnIcon fontSize="small" className="mr-1" /> Activate
                            </>
                        ) : (
                            <>
                                <ToggleOffIcon fontSize="small" className="mr-1" /> Deactivate
                            </>
                        )}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Users</h4>
                        <GroupsIcon className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">248</p>
                    <div className="flex items-center text-sm">
                        <span className="text-green-600">+12</span>
                        <span className="text-gray-600 ml-2">this month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Active Users</h4>
                        <PersonAddAlt1Icon className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">186</p>
                    <div className="flex items-center text-sm">
                        <span className="text-green-600">75%</span>
                        <span className="text-gray-600 ml-2">active rate</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Admin Users</h4>
                        <AdminPanelSettingsIcon className="text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">12</p>
                    <div className="flex items-center text-sm">
                        <span className="text-blue-600">5%</span>
                        <span className="text-gray-600 ml-2">of total</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Pending Invites</h4>
                        <EmailIcon className="text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">8</p>
                    <div className="flex items-center text-sm">
                        <span className="text-orange-600">3</span>
                        <span className="text-gray-600 ml-2">expiring</span>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg">
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label
                            htmlFor="roleFilter"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>
                        <select
                            id="roleFilter"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Operator">Operator</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label
                            htmlFor="statusFilter"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>
                        <select
                            id="statusFilter"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center">
                            <FilterListIcon className="mr-2" /> Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <CustomTable columns={columns} data={users} pageSize={4} />
        </div>
    );
};

export default StaffScreen;