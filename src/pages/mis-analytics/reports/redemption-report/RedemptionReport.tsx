import React, { useState } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomTable, { Column } from "../../../../components/CustomTable";

const RedemptionReport = () => {
    const [stakeholder, setStakeholder] = useState("All");
    const [sku, setSku] = useState("All");
    const [geo, setGeo] = useState("All");
    const [dateRange, setDateRange] = useState("");

    const columns: Column[] = [
        { key: "redemptionId", label: "Redemption ID" },
        { key: "userFullName", label: "User Full Name" },
        { key: "userUniqueCode", label: "User Unique Code" },
        { key: "redeemedPoints", label: "Redeemed Points" },
        {
            key: "status",
            label: "Status",
            render: (row: any) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}
                >
                    {row.status}
                </span>
            )
        },
        { key: "mobileNumber", label: "User Mobile Number" },
        { key: "userType", label: "User Type" },
        { key: "dateOfJoining", label: "Date of Joining" },
        { key: "totalEarnedPoints", label: "Total Earned Points" },
        { key: "requestDate", label: "Redemption Request Date" },
        { key: "processedDate", label: "Redemption Processed Date" },
        { key: "details", label: "Redemption Details" }
    ];

    const sampleData = [
        {
            redemptionId: "RDM12345",
            userFullName: "John Doe",
            userUniqueCode: "USR001",
            redeemedPoints: 150,
            status: "Approved",
            statusColor: "bg-green-100 text-green-600",
            mobileNumber: "9876543210",
            userType: "Mechanic",
            dateOfJoining: "2022-05-10",
            totalEarnedPoints: 3200,
            requestDate: "2023-10-01 10:30",
            processedDate: "2023-10-02 14:10",
            details: "Redeemed for shopping voucher"
        },
        {
            redemptionId: "RDM12346",
            userFullName: "Amit Sharma",
            userUniqueCode: "USR002",
            redeemedPoints: 200,
            status: "Pending",
            statusColor: "bg-yellow-100 text-yellow-600",
            mobileNumber: "9123456780",
            userType: "Workshop",
            dateOfJoining: "2021-03-12",
            totalEarnedPoints: 5100,
            requestDate: "2023-10-05 09:20",
            processedDate: "-",
            details: "Awaiting approval"
        },
        {
            redemptionId: "RDM12347",
            userFullName: "Rahul Verma",
            userUniqueCode: "USR003",
            redeemedPoints: 100,
            status: "Rejected",
            statusColor: "bg-red-100 text-red-600",
            mobileNumber: "9988776655",
            userType: "Mechanic",
            dateOfJoining: "2020-11-22",
            totalEarnedPoints: 2800,
            requestDate: "2023-10-08 15:45",
            processedDate: "2023-10-09 16:30",
            details: "Insufficient points"
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 w-full overflow-x-hidden">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">Redemption Report</h2>
                    <p className="text-gray-500 text-sm">View all redemption activity details</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md flex items-center text-sm whitespace-nowrap">
                        <DownloadIcon fontSize="small" className="mr-2" />
                        Export CSV
                    </button>

                    <button className="px-3 py-1.5 bg-red-600 text-white rounded-md flex items-center text-sm whitespace-nowrap">
                        <PictureAsPdfIcon fontSize="small" className="mr-2" />
                        Export PDF
                    </button>

                    <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md flex items-center text-sm whitespace-nowrap">
                        <AccessTimeIcon fontSize="small" className="mr-2" />
                        Schedule
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mt-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">

                    <div>
                        <label htmlFor="stakeholder" className="text-sm font-medium text-gray-600">
                            Stakeholder
                        </label>
                        <select
                            id="stakeholder"
                            aria-label="Stakeholder Filter"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={stakeholder}
                            onChange={(e) => setStakeholder(e.target.value)}
                        >
                            <option>All</option>
                            <option>Mechanic</option>
                            <option>Workshop</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sku" className="text-sm font-medium text-gray-600">
                            SKU
                        </label>
                        <select
                            id="sku"
                            aria-label="SKU Filter"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                        >
                            <option>All</option>
                            <option>SKU001</option>
                            <option>SKU002</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="geo" className="text-sm font-medium text-gray-600">
                            Geography
                        </label>
                        <select
                            id="geo"
                            aria-label="Geography Filter"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={geo}
                            onChange={(e) => setGeo(e.target.value)}
                        >
                            <option>All</option>
                            <option>Delhi</option>
                            <option>Mumbai</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dateRange" className="text-sm font-medium text-gray-600">
                            Date Range
                        </label>
                        <input
                            id="dateRange"
                            aria-label="Date Range Filter"
                            type="date"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-3">
                    <button className="px-5 py-2 bg-blue-600 text-white rounded-md flex items-center text-sm whitespace-nowrap">
                        <FilterListIcon fontSize="small" className="mr-2" />
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-x-auto">
                <CustomTable data={sampleData} columns={columns} pageSize={5} />
            </div>
        </div>
    );
};

export default RedemptionReport;