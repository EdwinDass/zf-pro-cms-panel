import React, { useState } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomTable, { Column } from "../../../../components/CustomTable";

const ReferralsReport = () => {
    const [stakeholder, setStakeholder] = useState("All");
    const [sku, setSku] = useState("All");
    const [geo, setGeo] = useState("All");
    const [dateRange, setDateRange] = useState("");

    const columns: Column[] = [
        { key: "senderUniqueCode", label: "Sender Unique Code" },
        { key: "senderMobile", label: "Sender Mobile Number" },
        { key: "senderName", label: "Sender Name" },
        { key: "receiverUniqueCode", label: "Receiver Unique Code" },
        { key: "receiverMobile", label: "Receiver Mobile Number" },
        { key: "receiverName", label: "Receiver Name" },
        { key: "referralCode", label: "Referral Code" },
        { key: "pointsSender", label: "Points Earned by Sender" },
        { key: "pointsReceiver", label: "Points Earned by Receiver" },
        { key: "dateOfReferral", label: "Date of Referral" }
    ];

    const sampleData = [
        {
            senderUniqueCode: "UC100",
            senderMobile: "9876543210",
            senderName: "John Doe",
            receiverUniqueCode: "UC200",
            receiverMobile: "9123456780",
            receiverName: "Amit Sharma",
            referralCode: "REF2025",
            pointsSender: 50,
            pointsReceiver: 30,
            dateOfReferral: "2025-11-15"
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 -ml-4">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Referrals Report</h2>
                    <p className="text-gray-500 text-sm">Referral activity overview</p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md flex items-center text-sm">
                        <DownloadIcon fontSize="small" className="mr-2" />
                        Export CSV
                    </button>

                    <button className="px-3 py-1.5 bg-red-600 text-white rounded-md flex items-center text-sm">
                        <PictureAsPdfIcon fontSize="small" className="mr-2" />
                        Export PDF
                    </button>

                    <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md flex items-center text-sm">
                        <AccessTimeIcon fontSize="small" className="mr-2" />
                        Schedule
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mt-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">

                    {/* Stakeholder */}
                    <div>
                        <label htmlFor="stakeholder" className="text-sm font-medium text-gray-600">
                            Stakeholder
                        </label>
                        <select
                            id="stakeholder"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={stakeholder}
                            onChange={(e) => setStakeholder(e.target.value)}
                        >
                            <option>All</option>
                            <option>Mechanic</option>
                            <option>Workshop</option>
                        </select>
                    </div>

                    {/* SKU */}
                    <div>
                        <label htmlFor="sku" className="text-sm font-medium text-gray-600">
                            SKU
                        </label>
                        <select
                            id="sku"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                        >
                            <option>All</option>
                            <option>SKU001</option>
                            <option>SKU002</option>
                        </select>
                    </div>

                    {/* Geography */}
                    <div>
                        <label htmlFor="geo" className="text-sm font-medium text-gray-600">
                            Geography
                        </label>
                        <select
                            id="geo"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={geo}
                            onChange={(e) => setGeo(e.target.value)}
                        >
                            <option>All</option>
                            <option>Delhi</option>
                            <option>Mumbai</option>
                        </select>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label htmlFor="dateRange" className="text-sm font-medium text-gray-600">
                            Date Range
                        </label>
                        <input
                            id="dateRange"
                            type="date"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-3">
                    <button className="px-5 py-2 bg-blue-600 text-white rounded-md flex items-center text-sm">
                        <FilterListIcon fontSize="small" className="mr-2" />
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="mt-6">
                <CustomTable data={sampleData} columns={columns} pageSize={5} />
            </div>
        </div>
    );
};

export default ReferralsReport;