import React, { useState, useEffect, useCallback } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import CustomTable, { Column } from "../../../components/CustomTable";
import ViewImageModal from "../components/ViewImageModal";
import { getNotifications } from "../../../services/ApiService";

interface NotificationHistoryProps {
    onSelectNotification?: (id: number) => void;
}

interface Notification {
    id: number;
    notificationType: string;
    title: string;
    description: string;
    image: string | null;
    redirection: string | null;
    scheduledAt: string | null;
    sentAt: string | null;
    status: string;
    createdAt: string;
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ onSelectNotification }) => {
    const [titleFilter, setTitleFilter] = useState<string>("");
    const [descriptionFilter, setDescriptionFilter] = useState<string>("");
    const [fromDateFilter, setFromDateFilter] = useState<string>("");
    const [toDateFilter, setToDateFilter] = useState<string>("");
    const [notificationTypeFilter, setNotificationTypeFilter] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const pageSize = 10;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: pageSize,
                searchTitle: titleFilter || undefined,
                searchDescription: descriptionFilter || undefined,
                fromDate: fromDateFilter || undefined,
                toDate: toDateFilter || undefined,
                type: notificationTypeFilter || undefined
            };
            const response = await getNotifications(params);
            if (response && response.success) {
                const apiData = response.data || [];
                const mappedData: Notification[] = apiData.map((item: any) => ({
                    id: item.id,
                    notificationType: item.type || "Unknown",
                    title: item.title,
                    description: item.body,
                    image: item.imageUrl || null,
                    redirection: item.redirectionLink || null,
                    scheduledAt: item.scheduledAt || null,
                    sentAt: item.processedAt || null,
                    status: item.status || "Unknown",
                    createdAt: item.createdAt,
                }));
                setNotifications(mappedData);
                setTotalCount(response.totalCount || mappedData.length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, titleFilter, descriptionFilter, fromDateFilter, toDateFilter, notificationTypeFilter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string): string => {
        const colorMap: Record<string, string> = {
            send: "bg-green-100 text-green-600",
            failed: "bg-red-100 text-red-600",
            completed: "bg-green-100 text-green-600",
            pending: "bg-yellow-100 text-yellow-600",
        };
        return colorMap[status.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const getTypeColor = (type: string): string => {
        const colorMap: Record<string, string> = {
            manual: "bg-blue-100 text-blue-600",
            campaign: "bg-purple-100 text-purple-600",
            scheduled: "bg-orange-100 text-orange-600",
            regular: "bg-blue-100 text-blue-600",
        };
        return colorMap[type.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const columns: Column[] = [
        {
            key: "notificationType",
            label: "Notification Type",
            render: (notification: Notification) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.notificationType)}`}>
                    {notification.notificationType}
                </span>
            ),
        },
        {
            key: "title",
            label: "Title",
            render: (notification: Notification) => (
                <div className="font-medium text-gray-900">{notification.title}</div>
            ),
        },
        {
            key: "description",
            label: "Description",
            render: (notification: Notification) => (
                <div className="text-gray-600">{notification.description}</div>
            ),
        },
        {
            key: "image",
            label: "Image",
            render: (notification: Notification) => (
                notification.image ? (
                    <button
                        className="px-3 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md text-xs font-medium transition-colors"
                        onClick={() => {
                            setSelectedImage(notification.image);
                            setImageModalOpen(true);
                        }}
                    >
                        View Image
                    </button>
                ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                )
            ),
        },
        {
            key: "redirection",
            label: "Redirection",
            render: (notification: Notification) => (
                <div className="text-gray-600">{notification.redirection}</div>
            ),
        },
        {
            key: "scheduledAt",
            label: "Scheduled At",
            render: (notification: Notification) => (
                <div className="text-gray-600">{formatDate(notification.scheduledAt)}</div>
            ),
        },
        {
            key: "sentAt",
            label: "Sent At",
            render: (notification: Notification) => (
                <div className="text-gray-600">{formatDate(notification.sentAt)}</div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (notification: Notification) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                    {notification.status}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (notification: Notification) => (
                <div className="text-gray-600">{formatDate(notification.createdAt)}</div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (notification: Notification) => (
                <button
                    className="px-3 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md text-xs font-medium transition-colors"
                    onClick={() => onSelectNotification?.(notification.id)}
                >
                    View Logs
                </button>
            ),
        },
    ];

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleExport = () => {
        // Export functionality will be integrated later
        console.log("Export button clicked");
    };

    return (
        <div>
            {/* Filter Section — commented out for now
            <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="titleFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="titleFilter"
                            type="text"
                            title="Filter by notification title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Filter by title..."
                            value={titleFilter}
                            onChange={(e) => setTitleFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="descriptionFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <input
                            id="descriptionFilter"
                            type="text"
                            title="Filter by notification description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Filter by description..."
                            value={descriptionFilter}
                            onChange={(e) => setDescriptionFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="fromDateFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            From Date
                        </label>
                        <input
                            id="fromDateFilter"
                            type="date"
                            title="Select start date for filtering"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={fromDateFilter}
                            onChange={(e) => setFromDateFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="toDateFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            To Date
                        </label>
                        <input
                            id="toDateFilter"
                            type="date"
                            title="Select end date for filtering"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={toDateFilter}
                            onChange={(e) => setToDateFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="notificationTypeFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            Notification Type
                        </label>
                        <select
                            id="notificationTypeFilter"
                            title="Filter by notification type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={notificationTypeFilter}
                            onChange={(e) => setNotificationTypeFilter(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="manual">Manual</option>
                            <option value="campaign">Campaign</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>
            </div>
            */}

            {/* Export Button — commented out for now
            <div className="flex justify-end mb-6">
                <button
                    className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 bg-white hover:bg-green-50 rounded-lg text-sm font-medium transition-all active:scale-95 shadow-sm"
                    onClick={handleExport}
                    title="Export to Excel"
                >
                    <DownloadIcon fontSize="small" />
                    Export
                </button>
            </div>
            */}

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-600">Loading notifications...</div>
                </div>
            ) : (
                <CustomTable
                    columns={columns}
                    data={notifications}
                    pageSize={pageSize}
                    totalRows={totalCount}
                    currentPage={page}
                    onPageChange={onPageChange}
                />
            )}

            {/* View Image Modal */}
            <ViewImageModal
                isOpen={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                imageUrl={selectedImage}
            />
        </div>
    );
};

export default NotificationHistory;