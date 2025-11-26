import React, { useState, useEffect } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomTable, { Column } from "../../../../components/CustomTable";
import { getRedemptionHistory } from "../../../../services/ApiService";
import ExporterButton from "../../../../components/ExportButton";

const RedemptionReport = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [status, setStatus] = useState("");
    const [redemptionRef, setRedemptionRef] = useState("");

    const [tableData, setTableData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const columns: Column[] = [
        { key: "redemptionRef", label: "Redemption ID" },
        { key: "userName", label: "User Full Name" },
        { key: "userCode", label: "User Unique Code" },
        { key: "redeemedPoints", label: "Redeemed Points" },
        { key: "redemptionMode", label: "Redemption Mode" },
        {
            key: "redemptionStatus",
            label: "Status",
            render: (row: any) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}
                >
                    {row.redemptionStatus}
                </span>
            )
        },
        { key: "userMobile", label: "User Mobile Number" },
        { key: "userRole", label: "User Type" },
        { key: "dateOfJoining", label: "Date of Joining" },
        { key: "totalEarnedPoints", label: "Total Earned Points" },
        { key: "createdAt", label: "Redemption Request Date" },
        { key: "redemptionProcessedDate", label: "Redemption Processed Date" },
        { key: "redemptionDetails", label: "Redemption Details" }
    ];

    const getStatusColor = (value: string) => {
        if (value === "APPROVED") return "bg-green-100 text-green-600";
        if (value === "PENDING") return "bg-yellow-100 text-yellow-600";
        if (value === "REJECTED") return "bg-red-100 text-red-600";
        return "";
    };

    const fetchReport = async () => {
        try {
            const payload: any = {
                limit: pageSize,
                skip: (page - 1) * pageSize
            };

            if (fromDate) payload.fromDate = fromDate;
            if (toDate) payload.toDate = toDate;
            if (status) payload.status = [status];
            if (redemptionRef) payload.redemptionRef = [redemptionRef];

            const res = await getRedemptionHistory(payload);

            const mapped = res.data.data.reportList.map((item: any) => ({
                redemptionRef: item.redemptionRef,
                userName: item.userName,
                userCode: item.userCode,
                redeemedPoints: item.redeemedPoints,
                redemptionMode: item.redemptionMode,
                redemptionStatus: item.redemptionStatus,
                statusColor: getStatusColor(item.redemptionStatus),
                userMobile: item.userMobile,
                userRole: item.userRole,
                dateOfJoining: item.dateOfJoining,
                totalEarnedPoints: item.totalEarnedPoints,
                createdAt: item.createdAt,
                redemptionProcessedDate: item.redemptionProcessedDate,
                redemptionDetails: item.redemptionDetails
            }));

            setTableData(mapped);
            setTotalRows(res.data.data.totalCount);

        } catch (err) {
            console.error("API ERROR:", err);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [page]);

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    // EXPORT FUNCTION
    const fileExporter = async () => {
        try {
            const payload: any = {
                skip: 0,
                limit: totalRows,
            };

            if (fromDate) payload.fromDate = fromDate;
            if (toDate) payload.toDate = toDate;
            if (status) payload.status = [status];
            if (redemptionRef) payload.redemptionRef = [redemptionRef];

            const res = await getRedemptionHistory(payload);

            const mapped = res.data.data.reportList.map((item: any) => ({
                redemptionRef: item.redemptionRef,
                userName: item.userName,
                userCode: item.userCode,
                redeemedPoints: item.redeemedPoints,
                redemptionMode: item.redemptionMode,
                redemptionStatus: item.redemptionStatus,
                userMobile: item.userMobile,
                userRole: item.userRole,
                dateOfJoining: item.dateOfJoining,
                totalEarnedPoints: item.totalEarnedPoints,
                createdAt: item.createdAt,
                redemptionProcessedDate: item.redemptionProcessedDate,
                redemptionDetails: item.redemptionDetails
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
                    <h2 className="text-xl font-bold">Redemption Report</h2>
                    <p className="text-gray-500 text-sm">View all redemption activity details</p>
                </div>

                {/* ORIGINAL BUTTONS COMMENTED */}
                {/*
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
                */}

                {/* NEW EXPORT BUTTON */}
                <ExporterButton
                    exporter={fileExporter}
                    reportName="Redemption Report"
                />
            </div>

            {/* FILTERS */}
            <div className="mt-6">
                <div className="flex bg-gray-50 p-4 rounded-lg items-center gap-2">

                    <div className="w-[220px]">
                        <label htmlFor="fromDate" className="text-sm font-medium text-gray-600">
                            From Date
                        </label>
                        <input
                            id="fromDate"
                            type="date"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="w-[220px]">
                        <label htmlFor="toDate" className="text-sm font-medium text-gray-600">
                            To Date
                        </label>
                        <input
                            id="toDate"
                            type="date"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    <div className="w-[200px]">
                        <label htmlFor="statusSelect" className="text-sm font-medium text-gray-600">
                            Status
                        </label>
                        <select
                            id="statusSelect"
                            name="statusSelect"
                            aria-label="Redemption Status"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>

                    <div className="w-[240px]">
                        <label htmlFor="redemptionRefInput" className="text-sm font-medium text-gray-600">
                            Redemption Ref
                        </label>
                        <input
                            id="redemptionRefInput"
                            name="redemptionRefInput"
                            aria-label="Redemption Reference"
                            type="text"
                            placeholder="Enter Reference ID"
                            className="w-full px-2 py-1.5 mt-1 border rounded-md text-sm"
                            value={redemptionRef}
                            onChange={(e) => setRedemptionRef(e.target.value)}
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

export default RedemptionReport;