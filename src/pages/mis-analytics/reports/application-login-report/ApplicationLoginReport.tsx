import React, { useState } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomTable, { Column } from "../../../../components/CustomTable";

const ApplicationLoginReport = () => {
    const [stakeholder, setStakeholder] = useState("All");
    const [sku, setSku] = useState("All");
    const [geo, setGeo] = useState("All");
    const [dateRange, setDateRange] = useState("");

    const columns: Column[] = [
        { key: "userIdentifier", label: "User Name & UserId/Mobile" },
        { key: "firstLogin", label: "First Login Date & Time" },
        { key: "lastLogin", label: "Last Login Date & Time" },
        { key: "loginDevice", label: "Login Device" },
        { key: "logoutDate", label: "Logout Date & Time" },
        { key: "welcomePoints", label: "Welcome Points Earned" },
        { key: "totalScannedPoints", label: "Total Scanned Points" },
        { key: "totalRewardPoints", label: "Total Reward Points" },
        { key: "totalRedeemedPoints", label: "Total Redeemed Points" },
        { key: "totalBalancePoints", label: "Total Balance Points" }
    ];

    const sampleData = [
        {
            userIdentifier: "John Doe / USR001 / 9876543210",
            firstLogin: "2025-11-01 08:15",
            lastLogin: "2025-11-20 17:45",
            loginDevice: "Android",
            logoutDate: "2025-11-20 18:00",
            welcomePoints: 50,
            totalScannedPoints: 120,
            totalRewardPoints: 300,
            totalRedeemedPoints: 150,
            totalBalancePoints: 200
        },
        {
            userIdentifier: "Jane Smith / USR002 / 9123456780",
            firstLogin: "2025-10-15 09:30",
            lastLogin: "2025-11-18 15:22",
            loginDevice: "iOS",
            logoutDate: "2025-11-18 16:05",
            welcomePoints: 60,
            totalScannedPoints: 90,
            totalRewardPoints: 260,
            totalRedeemedPoints: 110,
            totalBalancePoints: 150
        },
        {
            userIdentifier: "Peter Parker / USR003 / 9988776655",
            firstLogin: "2025-10-02 07:20",
            lastLogin: "2025-11-19 14:40",
            loginDevice: "Android",
            logoutDate: "2025-11-19 15:00",
            welcomePoints: 30,
            totalScannedPoints: 80,
            totalRewardPoints: 190,
            totalRedeemedPoints: 90,
            totalBalancePoints: 100
        },
        {
            userIdentifier: "Tony Stark / USR004 / 9554433221",
            firstLogin: "2025-11-05 11:00",
            lastLogin: "2025-11-21 12:04",
            loginDevice: "Windows",
            logoutDate: "2025-11-21 12:30",
            welcomePoints: 100,
            totalScannedPoints: 400,
            totalRewardPoints: 800,
            totalRedeemedPoints: 300,
            totalBalancePoints: 500
        },
        {
            userIdentifier: "Bruce Wayne / USR005 / 9110091122",
            firstLogin: "2025-09-21 06:30",
            lastLogin: "2025-11-20 19:20",
            loginDevice: "Android",
            logoutDate: "2025-11-20 19:40",
            welcomePoints: 40,
            totalScannedPoints: 110,
            totalRewardPoints: 220,
            totalRedeemedPoints: 90,
            totalBalancePoints: 130
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow p-5 border border-gray-200 w-full overflow-x-hidden">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">Application Login Report</h2>
                    <p className="text-gray-500 text-sm">Login activity overview</p>
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

            {/* FILTERS */}
            <div className="mt-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">

                    {/* STAKEHOLDER */}
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

                    {/* SKU */}
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

                    {/* GEOGRAPHY */}
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

                    {/* DATE RANGE */}
                    <div>
                        <label htmlFor="dateRange" className="text-sm font-medium text-gray-600">
                            Date Range
                        </label>
                        <input
                            id="dateRange"
                            type="date"
                            aria-label="Date Range Filter"
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

            {/* TABLE */}
            <div className="mt-6 overflow-x-auto">
                <CustomTable data={sampleData} columns={columns} pageSize={10} />
            </div>

        </div>
    );
};

export default ApplicationLoginReport;