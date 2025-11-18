import React, { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import CustomTable, { Column } from "../../../components/CustomTable";

interface AccessLog {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    actionBadge: string;
    module: string;
    ipAddress: string;
    status: string;
    statusBadge: string;
}

const AccessLogsScreen: React.FC = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userFilter, setUserFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");

    const logs: AccessLog[] = [
        {
            id: 1,
            timestamp: "Oct 25, 2023 10:30:15 AM",
            user: "John Doe",
            action: "Login",
            actionBadge: "bg-green-100 text-green-600",
            module: "Authentication",
            ipAddress: "192.168.1.100",
            status: "Success",
            statusBadge: "bg-green-100 text-green-600",
        },
        {
            id: 2,
            timestamp: "Oct 25, 2023 10:15:22 AM",
            user: "Alice Smith",
            action: "Update",
            actionBadge: "bg-blue-100 text-blue-600",
            module: "User Management",
            ipAddress: "192.168.1.101",
            status: "Success",
            statusBadge: "bg-green-100 text-green-600",
        },
        {
            id: 3,
            timestamp: "Oct 25, 2023 09:45:33 AM",
            user: "Robert Johnson",
            action: "Delete",
            actionBadge: "bg-red-100 text-red-600",
            module: "Content",
            ipAddress: "192.168.1.102",
            status: "Success",
            statusBadge: "bg-green-100 text-green-600",
        },
        {
            id: 4,
            timestamp: "Oct 25, 2023 09:30:45 AM",
            user: "Emma Wilson",
            action: "Login Failed",
            actionBadge: "bg-orange-100 text-orange-600",
            module: "Authentication",
            ipAddress: "192.168.1.103",
            status: "Failed",
            statusBadge: "bg-red-100 text-red-600",
        },
        {
            id: 5,
            timestamp: "Oct 25, 2023 09:15:12 AM",
            user: "Michael Brown",
            action: "Logout",
            actionBadge: "bg-gray-100 text-gray-600",
            module: "Authentication",
            ipAddress: "192.168.1.104",
            status: "Success",
            statusBadge: "bg-green-100 text-green-600",
        },
    ];

    // ------------------------
    // Columns for CustomTable
    // ------------------------
    const columns: Column[] = [
        { key: "timestamp", label: "Timestamp" },
        { key: "user", label: "User" },
        {
            key: "action",
            label: "Action",
            render: (log: AccessLog) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${log.actionBadge}`}
                >
                    {log.action}
                </span>
            ),
        },
        { key: "module", label: "Module" },
        { key: "ipAddress", label: "IP Address" },
        {
            key: "status",
            label: "Status",
            render: (log: AccessLog) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${log.statusBadge}`}
                >
                    {log.status}
                </span>
            ),
        },
    ];

    return (
        <div>

            {/* FILTER SECTION */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg">
                <div className="flex flex-wrap gap-4 mb-6">

                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="log-start-date" className="block mb-2 text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="log-start-date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="log-end-date" className="block mb-2 text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="log-end-date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="log-user-filter" className="block mb-2 text-sm font-medium text-gray-700">
                            User
                        </label>
                        <select
                            id="log-user-filter"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={userFilter}
                            onChange={(e) => setUserFilter(e.target.value)}
                        >
                            <option value="">All Users</option>
                            <option value="john.doe">John Doe</option>
                            <option value="alice.smith">Alice Smith</option>
                            <option value="robert.johnson">Robert Johnson</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="log-action-filter" className="block mb-2 text-sm font-medium text-gray-700">
                            Action
                        </label>
                        <select
                            id="log-action-filter"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                        >
                            <option value="">All Actions</option>
                            <option value="login">Login</option>
                            <option value="logout">Logout</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center">
                            <FilterListIcon className="mr-2" /> Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* CUSTOM TABLE FOR ACCESS LOGS */}
            <CustomTable columns={columns} data={logs} pageSize={5} />
        </div>
    );
};

export default AccessLogsScreen;