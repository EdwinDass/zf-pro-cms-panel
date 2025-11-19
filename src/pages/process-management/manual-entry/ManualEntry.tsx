import React from "react";
import CustomTable, { Column } from "../../../components/CustomTable";

interface ManualEntryRow {
    id: string;
    userName: string;
    initials: string;
    color: string;
    type: string;
    amount: string;
    datetime: string;
}

const ManualEntry: React.FC = () => {
    const columns: Column[] = [
        { key: "id", label: "Entry ID" },

        {
            key: "user",
            label: "User",
            render: (row: ManualEntryRow) => (
                <div className="flex items-center">
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${row.color}`}
                    >
                        {row.initials}
                    </div>
                    <span className="ml-3 text-gray-800 font-medium">
                        {row.userName}
                    </span>
                </div>
            ),
        },

        {
            key: "type",
            label: "Type",
            render: (row: ManualEntryRow) => {
                const badgeColor =
                    row.type === "Scan"
                        ? "bg-blue-100 text-blue-600"
                        : row.type === "Redemption"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700";

                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                        {row.type}
                    </span>
                );
            },
        },

        { key: "amount", label: "Amount/Points" },

        { key: "datetime", label: "Date/Time" },

        {
            key: "status",
            label: "Status",
            render: () => (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Completed
                </span>
            ),
        },
    ];

    const recentEntries: ManualEntryRow[] = [
        {
            id: "#MAN-1024",
            userName: "John Doe",
            initials: "JD",
            color: "bg-blue-100 text-blue-700",
            type: "Scan",
            amount: "₹1,500",
            datetime: "Oct 25, 2023 11:15 AM",
        },
        {
            id: "#MAN-1025",
            userName: "Alice Smith",
            initials: "AS",
            color: "bg-green-100 text-green-700",
            type: "Redemption",
            amount: "800 Points",
            datetime: "Oct 25, 2023 10:45 AM",
        },
        {
            id: "#MAN-1026",
            userName: "Robert Johnson",
            initials: "RJ",
            color: "bg-purple-100 text-purple-700",
            type: "Transaction",
            amount: "₹3,200",
            datetime: "Oct 24, 2023 04:30 PM",
        },
    ];

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT BOX — Manual Scan/Transaction Entry */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Manual Scan/Transaction Entry
                    </h3>

                    {/* User ID */}
                    <label htmlFor="scanUser" className="block text-sm text-gray-700 mb-1">
                        User ID / Mobile Number
                    </label>
                    <input
                        id="scanUser"
                        type="text"
                        placeholder="Enter user ID or mobile number"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />

                    {/* Entry Type */}
                    <label htmlFor="entryType" className="block text-sm text-gray-700 mb-1">
                        Entry Type
                    </label>
                    <select
                        id="entryType"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    >
                        <option value="scan">Scan</option>
                        <option value="transaction">Transaction</option>
                    </select>

                    {/* Amount */}
                    <label htmlFor="amount" className="block text-sm text-gray-700 mb-1">
                        Amount (₹)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />

                    {/* Merchant */}
                    <label htmlFor="merchant" className="block text-sm text-gray-700 mb-1">
                        Merchant/Store
                    </label>
                    <input
                        id="merchant"
                        type="text"
                        placeholder="Enter merchant/store name"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />

                    {/* Date */}
                    <label htmlFor="scanDate" className="block text-sm text-gray-700 mb-1">
                        Date
                    </label>
                    <input
                        id="scanDate"
                        type="date"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                    />

                    {/* Remarks */}
                    <label htmlFor="scanRemarks" className="block text-sm text-gray-700 mb-1">
                        Remarks
                    </label>
                    <textarea
                        id="scanRemarks"
                        placeholder="Enter any additional remarks"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm h-24 resize-none"
                    />

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                            Submit Entry
                        </button>
                    </div>
                </div>

                {/* RIGHT BOX — Manual Redemption Entry */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Manual Redemption Entry
                    </h3>

                    {/* User ID */}
                    <label htmlFor="redeemUser" className="block text-sm text-gray-700 mb-1">
                        User ID / Mobile Number
                    </label>
                    <input
                        id="redeemUser"
                        type="text"
                        placeholder="Enter user ID or mobile number"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />

                    {/* Points */}
                    <label htmlFor="points" className="block text-sm text-gray-700 mb-1">
                        Points to Redeem
                    </label>
                    <input
                        id="points"
                        type="number"
                        placeholder="Enter points to redeem"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />

                    {/* Redemption Type */}
                    <label htmlFor="redemptionType" className="block text-sm text-gray-700 mb-1">
                        Redemption Type
                    </label>
                    <select
                        id="redemptionType"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    >
                        <option value="cash">Cash</option>
                        <option value="voucher">Voucher</option>
                        <option value="credit">Credit</option>
                    </select>

                    {/* Redemption Value */}
                    <label htmlFor="redeemValue" className="block text-sm text-gray-700 mb-1">
                        Redemption Value (₹)
                    </label>
                    <input
                        id="redeemValue"
                        type="number"
                        placeholder="Enter redemption value"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />

                    {/* Date */}
                    <label htmlFor="redeemDate" className="block text-sm text-gray-700 mb-1">
                        Date
                    </label>
                    <input
                        id="redeemDate"
                        type="date"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                    />

                    {/* Remarks */}
                    <label htmlFor="redeemRemarks" className="block text-sm text-gray-700 mb-1">
                        Remarks
                    </label>
                    <textarea
                        id="redeemRemarks"
                        placeholder="Enter any additional remarks"
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm h-24 resize-none"
                    />

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                            Submit Entry
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Manual Entries</h3>
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                        View All
                    </button>
                </div>

                <CustomTable
                    pageSize={5}
                    columns={columns}
                    data={recentEntries}
                />
            </div>

        </div>
    );
};

export default ManualEntry;