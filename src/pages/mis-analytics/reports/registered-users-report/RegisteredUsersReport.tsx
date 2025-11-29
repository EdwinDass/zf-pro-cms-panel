import React, { useState, useEffect } from "react";

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

    const formatCell = (value: any) => {
        if (value === null || value === undefined || value === "") return "-";
        return value;
    };

    const columns: Column[] = [
        // { key: "userId", label: "User ID" },
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
            if (userName.length >= 3) payload.userName = userName;
            if (userMobile.length >= 3) payload.userMobile = userMobile;

            const res = await getregisteredUsersReport(payload);

            const mapped = res.data.data.reportList.map((item: any) => ({
                userId: formatCell(item.userId),
                uniqueCode: formatCell(item.uniqueCode),
                roleName: formatCell(item.roleName),
                status: formatCell(item.status),
                email: formatCell(item.email),
                mobileNumber: formatCell(item.mobile),
                fullName: formatCell(item.fullName),
                aadhaarMasked: formatCell(item.aadhaarNumberMasked),
                panNumber: formatCell(item.panNumber),
                aadhaarStatus: item.aadhaarStatus ? "Verified" : "Not Verified",
                gender: formatCell(item.gender),
                age: formatCell(item.age),
                country: formatCell(item.country),
                state: formatCell(item.state),
                city: formatCell(item.city),
                pincode: formatCell(item.pincode),
                zone: formatCell(item.zone),
                mappedRetailers: formatCell(item.mappedRetailers?.join(", "))
            }));

            setTableData(mapped);
            setTotalRows(res.data.data.totalCount);

        } catch (err) {
            console.error("API ERROR:", err);
        }
    };

    // Fetch on page/date change
    useEffect(() => {
        fetchReport();
    }, [page, fromDate, toDate]);

    // userName typing
    useEffect(() => {
        if (userName.length === 0) {
            setPage(1);
            fetchReport();
            return;
        }
        if (userName.length >= 3) {
            const timeout = setTimeout(() => {
                setPage(1);
                fetchReport();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [userName]);

    // userMobile typing
    useEffect(() => {
        if (userMobile.length === 0) {
            setPage(1);
            fetchReport();
            return;
        }
        if (userMobile.length >= 3) {
            const timeout = setTimeout(() => {
                setPage(1);
                fetchReport();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [userMobile]);

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
            if (userName.length >= 3) payload.userName = userName;
            if (userMobile.length >= 3) payload.userMobile = userMobile;

            const res = await getregisteredUsersReport(payload);

            const mapped = res.data.data.reportList.map((item: any) => ({
                userId: formatCell(item.userId),
                uniqueCode: formatCell(item.uniqueCode),
                roleName: formatCell(item.roleName),
                status: formatCell(item.status),
                email: formatCell(item.email),
                mobileNumber: formatCell(item.mobile),
                fullName: formatCell(item.fullName),
                aadhaarMasked: formatCell(item.aadhaarNumberMasked),
                panNumber: formatCell(item.panNumber),
                aadhaarStatus: item.aadhaarStatus ? "Verified" : "Not Verified",
                gender: formatCell(item.gender),
                age: formatCell(item.age),
                country: formatCell(item.country),
                state: formatCell(item.state),
                city: formatCell(item.city),
                pincode: formatCell(item.pincode),
                zone: formatCell(item.zone),
                mappedRetailers: formatCell(item.mappedRetailers?.join(", "))
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