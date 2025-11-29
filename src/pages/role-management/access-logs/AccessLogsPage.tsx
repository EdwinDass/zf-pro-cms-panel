import React, { useState, useEffect } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import { getActivityLogs } from "../../../services/ApiService";

interface AccessLog {
    id: number;
    timestamp: string;
    user: string;
    userMobile: string;
    userEmail: string;
    action: string;
    actionBadge: string;
}

const AccessLogsScreen: React.FC = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchFilter, setSearchFilter] = useState("");
    const [actionFilter, setActionFilter] = useState<"" | "login" | "logout">("");
    const [tableData, setTableData] = useState<AccessLog[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const formatCell = (value: any) => {
        if (value === null || value === undefined || value === "" || value === "N/A" || value === "Unknown") return "-";
        return value;
    };

    const columns: Column[] = [
        { key: "timestamp", label: "Timestamp" },
        { key: "user", label: "User" },
        { key: "userMobile", label: "User Mobile" },
        {
            key: "action",
            label: "Action",
            render: (log: AccessLog) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.actionBadge}`}>
                    {log.action}
                </span>
            ),
        },
        { key: "userEmail", label: "User Email" },
    ];

    const fetchLogs = async () => {
        try {
            const payload: any = {
                page: page,
                limit: pageSize,
            };

            if (startDate) payload.fromDate = startDate;
            if (endDate) payload.toDate = endDate;
            if (actionFilter) payload.activityType = actionFilter;
            if (searchFilter.length >= 3) payload.search = searchFilter;

            const res = await getActivityLogs(payload);

            const mapped = res.data.data.map((item: any) => ({
                id: item.logId,
                timestamp: new Date(item.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                }),
                user: formatCell(item.userName),
                userMobile: formatCell(item.userMobile),
                userEmail: formatCell(item.userEmail),
                action: formatCell(item.activityType.charAt(0).toUpperCase() + item.activityType.slice(1)),
                actionBadge: getActionBadge(item.activityType),
            }));

            setTableData(mapped);
            setTotalRows(res.data.totalRecords);

        } catch (err) {
            console.error("API ERROR:", err);
        }
    };

    const getActionBadge = (action: string) => {
        if (!action) return "bg-gray-100 text-gray-600";
        const value = action.toLowerCase();
        if (value === "login") return "bg-green-100 text-green-600";
        if (value === "logout") return "bg-gray-100 text-gray-600";
        return "bg-gray-100 text-gray-600";
    };

    useEffect(() => {
        fetchLogs();
    }, [page, startDate, endDate, actionFilter]);

    useEffect(() => {
        setPage(1);
    }, [startDate, endDate, actionFilter]);

    useEffect(() => {
        if (searchFilter.length === 0) {
            setPage(1);
            fetchLogs();
            return;
        }
        if (searchFilter.length >= 3) {
            const timeout = setTimeout(() => {
                setPage(1);
                fetchLogs();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [searchFilter]);

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-4 mb-4">

                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="from-date-filter" className="block mb-2 text-sm font-medium text-gray-700">
                                From Date
                            </label>
                            <input
                                id="from-date-filter"
                                type="date"
                                aria-label="Filter From Date"
                                title="Select starting date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="to-date-filter" className="block mb-2 text-sm font-medium text-gray-700">
                                To Date
                            </label>
                            <input
                                id="to-date-filter"
                                type="date"
                                aria-label="Filter To Date"
                                title="Select ending date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="action-filter" className="block mb-2 text-sm font-medium text-gray-700">
                                Action
                            </label>
                            <select
                                id="action-filter"
                                aria-label="Select Action Type"
                                title="Filter by Action"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value as "" | "login" | "logout")}
                            >
                                <option value="">All Actions</option>
                                <option value="login">Login</option>
                                <option value="logout">Logout</option>
                            </select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="search-input" className="block mb-2 text-sm font-medium text-gray-700">
                                Search
                            </label>
                            <input
                                id="search-input"
                                type="text"
                                aria-label="Search logs"
                                title="Search (min 3 characters)"
                                placeholder="Search (min 3 characters)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                            />
                        </div>

                    </div>
                </div>
            </div>

            <CustomTable
                columns={columns}
                data={tableData}
                pageSize={pageSize}
                totalRows={totalRows}
                currentPage={page}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default AccessLogsScreen;