import React, { useState } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomTable, { Column } from "../../../../components/CustomTable";

const RegisteredUsersReport = () => {
    const [stakeholder, setStakeholder] = useState("All");
    const [sku, setSku] = useState("All");
    const [geo, setGeo] = useState("All");
    const [dateRange, setDateRange] = useState("");

    const columns: Column[] = [
        { key: "userId", label: "User ID" },
        { key: "uniqueCode", label: "Unique Code" },
        { key: "roleName", label: "Role Name" },
        { key: "status", label: "Status" },
        { key: "email", label: "Email" },
        { key: "mobileNumber", label: "Mobile Number" },
        { key: "fullName", label: "Full Name" },
        { key: "aadhaarMasked", label: "Aadhaar Number (Masking)" },
        { key: "panNumber", label: "PAN Number" },
        { key: "aadhaarStatus", label: "Aadhaar Status" },
        { key: "dob", label: "Date of Birth" },
        { key: "gender", label: "Gender" },
        { key: "age", label: "Age" },
        { key: "country", label: "Country" },
        { key: "state", label: "State" },
        { key: "city", label: "City" },
        { key: "pincode", label: "Pincode" },
        { key: "mappedRetailer1", label: "Mapped Retailer 1" },
        { key: "mappedRetailer2", label: "Mapped Retailer 2" }
    ];

    const sampleData = [
        {
            userId: "USR001",
            uniqueCode: "UC001",
            roleName: "Mechanic",
            status: "Active",
            email: "john@example.com",
            mobileNumber: "9876543210",
            fullName: "John Doe",
            aadhaarMasked: "XXXX-XXXX-1234",
            panNumber: "ABCDE1234F",
            aadhaarStatus: "Verified",
            dob: "1990-05-10",
            gender: "Male",
            age: 35,
            country: "India",
            state: "Delhi",
            city: "New Delhi",
            pincode: "110001",
            mappedRetailer1: "Retailer A",
            mappedRetailer2: "Retailer B"
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 w-full overflow-x-hidden">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">Registered Users Report</h2>
                    <p className="text-gray-500 text-sm">List of registered users</p>
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

export default RegisteredUsersReport;