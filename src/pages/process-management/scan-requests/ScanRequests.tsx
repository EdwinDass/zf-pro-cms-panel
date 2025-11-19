import React from "react";
import CustomTable, { Column } from "../../../components/CustomTable";

interface ScanRequest {
    id: string;
    userName: string;
    initials: string;
    color: string;
    type: "Scan" | "Transaction";
    amount: string;
    datetime: string;
}

const ScanRequests: React.FC = () => {
    const data: ScanRequest[] = [
        {
            id: "#REQ-2847",
            userName: "John Doe",
            initials: "JD",
            color: "bg-blue-500",
            type: "Scan",
            amount: "₹2,500",
            datetime: "Oct 25, 2023 09:15 AM",
        },
        {
            id: "#REQ-2848",
            userName: "Alice Smith",
            initials: "AS",
            color: "bg-green-500",
            type: "Transaction",
            amount: "₹5,200",
            datetime: "Oct 25, 2023 09:22 AM",
        },
        {
            id: "#REQ-2849",
            userName: "Robert Johnson",
            initials: "RJ",
            color: "bg-purple-500",
            type: "Scan",
            amount: "₹1,800",
            datetime: "Oct 25, 2023 09:35 AM",
        },
        {
            id: "#REQ-2850",
            userName: "Emma Wilson",
            initials: "EW",
            color: "bg-yellow-500",
            type: "Transaction",
            amount: "₹3,750",
            datetime: "Oct 25, 2023 09:48 AM",
        },
    ];

    const getTypeBadge = (type: string) => {
        return type === "Scan"
            ? "bg-blue-100 text-blue-600"
            : "bg-green-100 text-green-600";
    };

    const columns: Column[] = [
        { key: "id", label: "Request ID" },

        {
            key: "user",
            label: "User",
            render: (row: ScanRequest) => (
                <div className="flex items-center">
                    <div
                        className={`w-10 h-10 rounded-full ${row.color} flex justify-center items-center text-white font-semibold`}
                    >
                        {row.initials}
                    </div>
                    <div className="ml-3">
                        <div className="font-medium text-gray-900">{row.userName}</div>
                    </div>
                </div>
            ),
        },

        {
            key: "type",
            label: "Type",
            render: (row: ScanRequest) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(
                        row.type
                    )}`}
                >
                    {row.type}
                </span>
            ),
        },

        { key: "amount", label: "Amount" },

        { key: "datetime", label: "Date/Time" },

        {
            key: "actions",
            label: "Actions",
            render: () => (
                <div className="flex space-x-4">
                    <button className="text-green-600 hover:text-green-800 font-medium">
                        Approve
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-medium">
                        Reject
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>

            {/* --- Dashboard Overview Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Pending Requests */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-600">Pending Requests</h4>
                        <i className="fas fa-clock text-orange-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-orange-600 font-semibold">+8</span> today
                    </p>
                </div>

                {/* Approved Today */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-600">Approved Today</h4>
                        <i className="fas fa-check-circle text-green-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-green-600 font-semibold">+12%</span> from yesterday
                    </p>
                </div>

                {/* Rejected Today */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-600">Rejected Today</h4>
                        <i className="fas fa-times-circle text-red-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-red-600 font-semibold">-3</span> from yesterday
                    </p>
                </div>

                {/* Total Processed */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-600">Total Processed</h4>
                        <i className="fas fa-chart-line text-blue-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">1,842</p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-blue-600 font-semibold">+124</span> this week
                    </p>
                </div>

            </div>

            {/* --- Custom Scan Request Table --- */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg mt-6">

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Pending Scan/Transaction Requests
                    </h3>

                    <div className="flex space-x-3">
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">
                            <i className="fas fa-filter mr-1"></i> Filter
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">
                            <i className="fas fa-download mr-1"></i> Export
                        </button>
                    </div>
                </div>

                <CustomTable columns={columns} data={data} pageSize={4} />
            </div>
        </div>
    );
};

export default ScanRequests;