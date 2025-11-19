import React from "react";
import CustomTable, { Column } from "../../../components/CustomTable";

interface RedemptionRequest {
    id: string;
    userName: string;
    initials: string;
    color: string;
    points: string;
    value: string;
    datetime: string;
}

const RedemptionRequests: React.FC = () => {
    const data: RedemptionRequest[] = [
        {
            id: "#RED-1826",
            userName: "Robert Johnson",
            initials: "RJ",
            color: "bg-purple-200 text-purple-700",
            points: "750",
            value: "₹750",
            datetime: "Oct 25, 2023 10:35 AM",
        },
        {
            id: "#RED-1827",
            userName: "Emma Wilson",
            initials: "EW",
            color: "bg-yellow-200 text-yellow-700",
            points: "2,000",
            value: "₹2,000",
            datetime: "Oct 25, 2023 10:48 AM",
        },
    ];

    const columns: Column[] = [
        { key: "id", label: "Request ID" },

        {
            key: "user",
            label: "User",
            render: (row: RedemptionRequest) => (
                <div className="flex items-center">
                    <div
                        className={`w-10 h-10 rounded-full flex justify-center items-center text-sm font-semibold ${row.color}`}
                    >
                        {row.initials}
                    </div>
                    <div className="ml-3">
                        <div className="font-medium text-gray-900">{row.userName}</div>
                    </div>
                </div>
            ),
        },

        { key: "points", label: "Points" },

        { key: "value", label: "Value" },

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

            {/* --- Dashboard Summary Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Pending Redemptions */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-600">Pending Redemptions</h4>
                        <i className="fas fa-clock text-orange-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">28</p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-orange-600 font-semibold">+5</span> today
                    </p>
                </div>

                {/* Approved Today */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-600">Approved Today</h4>
                        <i className="fas fa-check-circle text-green-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">62</p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-green-600 font-semibold">+8%</span> from yesterday
                    </p>
                </div>

                {/* Rejected Today */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-600">Rejected Today</h4>
                        <i className="fas fa-times-circle text-red-500"></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-red-600 font-semibold">-1</span> from yesterday
                    </p>
                </div>

                {/* Total Value Today */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-600">Total Value Today</h4>
                        <span className="text-blue-600 font-semibold">₹</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹48,650</p>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="text-blue-600 font-semibold">+12%</span> from yesterday
                    </p>
                </div>
            </div>

            {/* --- Redemption Request Table --- */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mt-6">

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Pending Redemption Requests
                    </h3>

                    <div className="flex space-x-3">
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center">
                            <i className="fas fa-filter mr-1"></i> Filter
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center">
                            <i className="fas fa-download mr-1"></i> Export
                        </button>
                    </div>
                </div>

                <CustomTable columns={columns} data={data} pageSize={4} />
            </div>
        </div>
    );
};

export default RedemptionRequests;