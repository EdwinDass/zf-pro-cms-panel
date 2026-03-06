import React, { useState, useEffect, useCallback } from "react";
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

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "FANNED_OUT", label: "Fanned Out" },
    { value: "COMPLETED", label: "Completed" },
    { value: "FAILED", label: "Failed" },
];

const TYPE_OPTIONS = [
    { value: "", label: "All Types" },
    { value: "REGULAR", label: "Regular" },
    { value: "CAMPAIGN", label: "Campaign" },
];

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ onSelectNotification }) => {
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<string>("");
    const [dateFromFilter, setDateFromFilter] = useState<string>("");
    const [dateToFilter, setDateToFilter] = useState<string>("");
    const [scheduledFromFilter, setScheduledFromFilter] = useState<string>("");
    const [scheduledToFilter, setScheduledToFilter] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const pageSize = 10;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = {
                page,
                limit: pageSize,
            };
            if (searchFilter) params.search = searchFilter;
            if (statusFilter) params.status = statusFilter;
            if (typeFilter) params.type = typeFilter;
            if (dateFromFilter) params.dateFrom = dateFromFilter;
            if (dateToFilter) params.dateTo = dateToFilter;
            if (scheduledFromFilter) params.scheduledFrom = scheduledFromFilter;
            if (scheduledToFilter) params.scheduledTo = scheduledToFilter;

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
                setTotalCount(response.total || mappedData.length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, searchFilter, statusFilter, typeFilter, dateFromFilter, dateToFilter, scheduledFromFilter, scheduledToFilter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Reset to page 1 when any filter changes
    const handleSearchChange = (val: string) => { setSearchFilter(val); setPage(1); };
    const handleStatusChange = (val: string) => { setStatusFilter(val); setPage(1); };
    const handleTypeChange = (val: string) => { setTypeFilter(val); setPage(1); };
    const handleDateFromChange = (val: string) => { setDateFromFilter(val); setPage(1); };
    const handleDateToChange = (val: string) => { setDateToFilter(val); setPage(1); };
    const handleScheduledFromChange = (val: string) => { setScheduledFromFilter(val); setPage(1); };
    const handleScheduledToChange = (val: string) => { setScheduledToFilter(val); setPage(1); };

    const handleClearFilters = () => {
        setSearchFilter("");
        setStatusFilter("");
        setTypeFilter("");
        setDateFromFilter("");
        setDateToFilter("");
        setScheduledFromFilter("");
        setScheduledToFilter("");
        setPage(1);
    };

    const hasActiveFilters = searchFilter || statusFilter || typeFilter || dateFromFilter || dateToFilter || scheduledFromFilter || scheduledToFilter;

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
            completed: "bg-green-100 text-green-600",
            failed: "bg-red-100 text-red-600",
            pending: "bg-yellow-100 text-yellow-600",
            processing: "bg-blue-100 text-blue-600",
            fanned_out: "bg-purple-100 text-purple-600",
        };
        return colorMap[status.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const getTypeColor = (type: string): string => {
        const colorMap: Record<string, string> = {
            regular: "bg-blue-100 text-blue-600",
            campaign: "bg-purple-100 text-purple-600",
        };
        return colorMap[type.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const columns: Column[] = [
        {
            key: "notificationType",
            label: "Type",
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
                <div className="text-gray-600 text-sm max-w-xs truncate">{notification.description}</div>
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
                            setSelectedImageId(notification.id);
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
                <div className="text-gray-600 text-sm truncate max-w-xs">{notification.redirection || "—"}</div>
            ),
        },
        {
            key: "scheduledAt",
            label: "Scheduled At",
            render: (notification: Notification) => (
                <div className="text-gray-600 text-sm">{formatDate(notification.scheduledAt)}</div>
            ),
        },
        {
            key: "sentAt",
            label: "Sent At",
            render: (notification: Notification) => (
                <div className="text-gray-600 text-sm">{formatDate(notification.sentAt)}</div>
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
                <div className="text-gray-600 text-sm">{formatDate(notification.createdAt)}</div>
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

    return (
        <div>
            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-5 border border-gray-100">
                <div className="flex flex-wrap gap-3">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="searchFilter" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Search
                        </label>
                        <input
                            id="searchFilter"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Search title or body..."
                            value={searchFilter}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Status */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="statusFilter" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Status
                        </label>
                        <select
                            id="statusFilter"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Type */}
                    <div className="flex-1 min-w-[140px]">
                        <label htmlFor="typeFilter" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Type
                        </label>
                        <select
                            id="typeFilter"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            value={typeFilter}
                            onChange={(e) => handleTypeChange(e.target.value)}
                        >
                            {TYPE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="dateFromFilter" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            From Date
                        </label>
                        <input
                            id="dateFromFilter"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={dateFromFilter}
                            onChange={(e) => handleDateFromChange(e.target.value)}
                        />
                    </div>

                    {/* Date To */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="dateToFilter" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            To Date
                        </label>
                        <input
                            id="dateToFilter"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={dateToFilter}
                            onChange={(e) => handleDateToChange(e.target.value)}
                        />
                    </div>

                    {/* Scheduled From */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="scheduledFromFilter" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Scheduled From
                        </label>
                        <input
                            id="scheduledFromFilter"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={scheduledFromFilter}
                            onChange={(e) => handleScheduledFromChange(e.target.value)}
                        />
                    </div>

                    {/* Scheduled To */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="scheduledToFilter" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Scheduled To
                        </label>
                        <input
                            id="scheduledToFilter"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={scheduledToFilter}
                            onChange={(e) => handleScheduledToChange(e.target.value)}
                        />
                    </div>

                    {/* Clear button */}
                    {hasActiveFilters && (
                        <div className="flex items-end">
                            <button
                                onClick={handleClearFilters}
                                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="flex items-center gap-3 text-gray-500">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Loading notifications...
                    </div>
                </div>
            ) : (
                <CustomTable
                    columns={columns}
                    data={notifications}
                    pageSize={pageSize}
                    totalRows={totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                />
            )}

            {/* View Image Modal */}
            <ViewImageModal
                isOpen={imageModalOpen}
                onClose={() => { setImageModalOpen(false); setSelectedImageId(null); }}
                imageUrl={selectedImage}
                notificationId={selectedImageId}
            />
        </div>
    );
};

export default NotificationHistory;