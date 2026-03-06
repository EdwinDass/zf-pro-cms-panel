import React, { useState, useEffect, useCallback } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import { getNotificationLogs } from "../../../services/ApiService";

interface NotificationLog {
    id: number;
    notificationId: number;
    userId: number;
    status: string;
    failureReason: string | null;
    scheduledAt: string | null;
    processedAt: string | null;
    createdAt: string;
}

interface NotificationLogsProps {
    notificationId: number | null;
}

const NotificationLogs: React.FC<NotificationLogsProps> = ({ notificationId }) => {
    const [logs, setLogs] = useState<NotificationLog[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const pageSize = 10;

    const fetchLogs = useCallback(async () => {
        if (!notificationId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await getNotificationLogs(notificationId, page, pageSize);
            if (res && res.success && Array.isArray(res.data)) {
                setLogs(res.data);
                setTotalCount(res.total || 0);
            } else {
                setError("Failed to load logs.");
            }
        } catch (err) {
            console.error("Failed to fetch notification logs:", err);
            setError("An error occurred while fetching logs.");
        } finally {
            setLoading(false);
        }
    }, [notificationId, page, pageSize]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string): string => {
        const colorMap: Record<string, string> = {
            sent: "bg-green-100 text-green-600",
            failed: "bg-red-100 text-red-600",
            pending: "bg-yellow-100 text-yellow-600",
        };
        return colorMap[status.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const columns: Column[] = [
        {
            key: "id",
            label: "Log ID",
            render: (log: NotificationLog) => (
                <div className="text-gray-500 text-sm font-mono">#{log.id}</div>
            ),
        },
        {
            key: "userId",
            label: "User ID",
            render: (log: NotificationLog) => (
                <div className="font-medium text-gray-900">{log.userId}</div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (log: NotificationLog) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                    {log.status}
                </span>
            ),
        },
        {
            key: "failureReason",
            label: "Failure Reason",
            render: (log: NotificationLog) => (
                <div className="text-red-500 text-sm">
                    {log.failureReason || <span className="text-gray-400">—</span>}
                </div>
            ),
        },
        {
            key: "processedAt",
            label: "Processed At",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{formatDate(log.processedAt)}</div>
            ),
        },
        {
            key: "scheduledAt",
            label: "Scheduled At",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{formatDate(log.scheduledAt)}</div>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{formatDate(log.createdAt)}</div>
            ),
        },
    ];

    if (!notificationId) {
        return (
            <div className="bg-white rounded-xl shadow p-12 border border-gray-100 text-center">
                <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p className="text-gray-500 font-medium">Select a notification from history to view its logs</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Notification Logs</h3>
                    <p className="text-sm text-gray-500">Notification #{notificationId} · {totalCount} log entries</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="flex items-center gap-3 text-gray-500">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Loading notification logs...
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
                    {error}
                </div>
            ) : (
                <CustomTable
                    columns={columns}
                    data={logs}
                    pageSize={pageSize}
                    totalRows={totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default NotificationLogs;