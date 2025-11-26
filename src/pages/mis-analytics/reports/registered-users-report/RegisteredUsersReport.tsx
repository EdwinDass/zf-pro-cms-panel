import React, { useState, useEffect } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import CustomTable, { Column } from "../../../../components/CustomTable";
import { getregisteredUsersReport } from "../../../../services/ApiService";
import ExporterButton from "../../../../components/ExportButton";

const RegisteredUsersReport = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [userName, setUserName] = useState("");
    const [userMobile, setUserMobile] = useState("");
    const [tableData, setTableData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const columns: Column[] = [
        { key: "userId", label: "User ID" },
        { key: "uniqueCode", label: "Unique Code" },
        { key: "roleName", label: "Role Name" },
        { key: "status", label: "Status" },
        { key: "email", label: "Email" },
        { key: "mobileNumber", label: "Mobile Number" },
        { key: "fullName", label: "Full Name" },
        { key: "aadhaarMasked", label: "Aadhaar Number (masking)" },
        { key: "panNumber", label: "PAN Number" },
        { key: "aadhaarStatus", label: "Aadhaar Status" },
        { key: "gender", label: "Gender" },
        { key: "age", label: "Age" },
        { key: "country", label: "Country" },
        { key: "state", label: "State" },
        { key: "city", label: "City" },
        { key: "pincode", label: "Pincode" },
        { key: "zone", label: "Zone" },
        { key: "mappedRetailers", label: "Mapped Retailers" }
    ];

    const fetchReport = async () => {
        try {
            const payload: any = {
                limit: pageSize,
                skip: (page - 1) * pageSize
            };

            if (fromDate) payload.fromDate = fromDate;
            if (toDate) payload.toDate = toDate;
            if (userName) payload.userName = userName;
            if (userMobile) payload.userMobile = userMobile;

            const res = await getregisteredUsersReport(payload);

            const mapped = res.data.data.reportList.map((item: any) => ({
                userId: item.userId,
                uniqueCode: item.uniqueCode,
                roleName: item.roleName,
                status: item.status,
                email: item.email,
                mobileNumber: item.mobile,
                fullName: item.fullName,
                aadhaarMasked: item.aadhaarNumberMasked ?? "",
                panNumber: item.panNumber ?? "",
                aadhaarStatus: item.aadhaarStatus ? "Verified" : "Not Verified",
                gender: item.gender ?? "",
                age: item.age ?? "",
                country: item.country ?? "",
                state: item.state ?? "",
                city: item.city ?? "",
                pincode: item.pincode ?? "",
                zone: item.zone ?? "",
                mappedRetailers: item.mappedRetailers?.join(", ") ?? "",
            }));

            setTableData(mapped);
            setTotalRows(res.data.data.totalCount);

        } catch (err) {
            console.error("API ERROR:", err);
        }
    };

    useEffect(() => {
        fetchReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    const fileExporter = async () => {
        try {
            const payload: any = {
                skip: 0,
                limit: totalRows,
            };

            if (fromDate) payload.fromDate = fromDate;
            if (toDate) payload.toDate = toDate;
            if (userName) payload.userName = userName;
            if (userMobile) payload.userMobile = userMobile;

            const res = await getregisteredUsersReport(payload);

            const mapped = res.data.data.reportList.map((item: any) => ({
                userId: item.userId,
                uniqueCode: item.uniqueCode,
                roleName: item.roleName,
                status: item.status,
                email: item.email,
                mobileNumber: item.mobile,
                fullName: item.fullName,
                aadhaarMasked: item.aadhaarNumberMasked ?? "",
                panNumber: item.panNumber ?? "",
                aadhaarStatus: item.aadhaarStatus ? "Verified" : "Not Verified",
                gender: item.gender ?? "",
                age: item.age ?? "",
                country: item.country ?? "",
                state: item.state ?? "",
                city: item.city ?? "",
                pincode: item.pincode ?? "",
                zone: item.zone ?? "",
                mappedRetailers: item.mappedRetailers?.join(", ") ?? "",
            }));

            return mapped;

        } catch (err) {
            console.error("EXPORT ERROR:", err);
            return [];
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 w-full overflow-x-hidden">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">Registered Users Report</h2>
                    <p className="text-gray-500 text-sm">List of registered users</p>
                </div>

                <ExporterButton
                    exporter={fileExporter}
                    reportName="Registered Users Report"
                />
            </div>

            <div className="mt-6">

                <div className="flex bg-gray-50 p-4 rounded-lg flex-wrap items-end gap-4">

                    <div className="w-[220px]">
                        <label htmlFor="fromDate" className="text-sm font-medium text-gray-600">From Date</label>
                        <input
                            id="fromDate"
                            type="date"
                            title="Select from date"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="w-[220px]">
                        <label htmlFor="toDate" className="text-sm font-medium text-gray-600">To Date</label>
                        <input
                            id="toDate"
                            type="date"
                            title="Select to date"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    <div className="w-[220px]">
                        <label htmlFor="userName" className="text-sm font-medium text-gray-600">User Name</label>
                        <input
                            id="userName"
                            type="text"
                            placeholder="Enter user name"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>

                    <div className="w-[220px]">
                        <label htmlFor="userMobile" className="text-sm font-medium text-gray-600">Mobile Number</label>
                        <input
                            id="userMobile"
                            type="text"
                            placeholder="Enter mobile number"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={userMobile}
                            onChange={(e) => setUserMobile(e.target.value)}
                        />
                    </div>

                </div>

                <div className="flex justify-end mt-3">
                    <button
                        className="px-5 py-2 bg-blue-600 text-white rounded-md flex items-center text-sm whitespace-nowrap"
                        onClick={() => setPage(1)}
                    >
                        <FilterListIcon fontSize="small" className="mr-2" />
                        Apply Filters
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <CustomTable
                    data={tableData}
                    columns={columns}
                    pageSize={pageSize}
                    totalRows={totalRows}
                    currentPage={page}
                    onPageChange={onPageChange}
                />
            </div>

        </div>
    );
};

export default RegisteredUsersReport;