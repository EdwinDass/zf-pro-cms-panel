import React, { useState, useEffect, useCallback } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import ViewImageModal from "../components/ViewImageModal";
import { getCampaignNotifications } from "../../../services/ApiService";

interface CampaignNotificationsListProps {
    campaignId: number;
    campaignName: string;
    onSelectNotification: (id: number) => void;
}

interface CampaignNotification {
    id: number;
    title: string;
    body: string;
    imageUrl: string | null;
    redirectionLink: string | null;
    status: string;
    sentCount: number;
    failureCount: number;
    totalUsers: number;
    scheduledAt: string | null;
    processedAt: string | null;
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

const CampaignNotificationsList: React.FC<CampaignNotificationsListProps> = ({ campaignId, campaignName, onSelectNotification }) => {
    const [notifications, setNotifications] = useState<CampaignNotification[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const pageSize = 10;

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [scheduledFromFilter, setScheduledFromFilter] = useState<string>("");
    const [scheduledToFilter, setScheduledToFilter] = useState<string>("");

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getCampaignNotifications(campaignId, page, pageSize, {
                status: statusFilter || undefined,
                scheduledFrom: scheduledFromFilter || undefined,
                scheduledTo: scheduledToFilter || undefined,
            });
            if (res && res.success && Array.isArray(res.data)) {
                setNotifications(res.data);
                setTotalCount(res.total || 0);
            } else {
                setError("Failed to load notifications.");
            }
        } catch (err) {
            console.error("Failed to fetch campaign notifications:", err);
            setError("An error occurred while fetching notifications.");
        } finally {
            setLoading(false);
        }
    }, [campaignId, page, pageSize, statusFilter, scheduledFromFilter, scheduledToFilter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const resetPage = () => setPage(1);

    const handleClearFilters = () => {
        setStatusFilter("");
        setScheduledFromFilter("");
        setScheduledToFilter("");
        setPage(1);
    };

    const hasActiveFilters = statusFilter || scheduledFromFilter || scheduledToFilter;

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
            completed: "bg-green-100 text-green-600",
            failed: "bg-red-100 text-red-600",
            pending: "bg-yellow-100 text-yellow-600",
            processing: "bg-blue-100 text-blue-600",
            fanned_out: "bg-purple-100 text-purple-600",
        };
        return colorMap[status.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const columns: Column[] = [
        {
            key: "id",
            label: "ID",
            render: (n: CampaignNotification) => (
                <div className="text-gray-400 text-sm font-mono">#{n.id}</div>
            ),
        },
        {
            key: "title",
            label: "Title",
            render: (n: CampaignNotification) => (
                <div className="font-medium text-gray-900">{n.title}</div>
            ),
        },
        {
            key: "body",
            label: "Description",
            render: (n: CampaignNotification) => (
                <div className="text-gray-600 text-sm max-w-xs truncate">{n.body}</div>
            ),
        },
        {
            key: "image",
            label: "Image",
            render: (n: CampaignNotification) => (
                n.imageUrl ? (
                    <button
                        className="px-3 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md text-xs font-medium transition-colors"
                        onClick={() => { setSelectedImage(n.imageUrl); setSelectedImageId(n.id); setImageModalOpen(true); }}
                    >
                        View Image
                    </button>
                ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                )
            ),
        },
        {
            key: "redirectionLink",
            label: "Redirection",
            render: (n: CampaignNotification) => (
                <div className="text-gray-600 text-sm truncate max-w-xs">{n.redirectionLink || "—"}</div>
            ),
        },
        {
            key: "totalUsers",
            label: "Total Users",
            render: (n: CampaignNotification) => (
                <div className="text-gray-700 font-medium">{n.totalUsers}</div>
            ),
        },
        {
            key: "sentCount",
            label: "Sent",
            render: (n: CampaignNotification) => (
                <span className="text-green-600 font-medium">{n.sentCount}</span>
            ),
        },
        {
            key: "failureCount",
            label: "Failed",
            render: (n: CampaignNotification) => (
                <span className="text-red-500 font-medium">{n.failureCount}</span>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (n: CampaignNotification) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(n.status)}`}>
                    {n.status}
                </span>
            ),
        },
        {
            key: "scheduledAt",
            label: "Scheduled At",
            render: (n: CampaignNotification) => (
                <div className="text-gray-600 text-sm">{formatDate(n.scheduledAt)}</div>
            ),
        },
        {
            key: "processedAt",
            label: "Processed At",
            render: (n: CampaignNotification) => (
                <div className="text-gray-600 text-sm">{formatDate(n.processedAt)}</div>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (n: CampaignNotification) => (
                <div className="text-gray-600 text-sm">{formatDate(n.createdAt)}</div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (n: CampaignNotification) => (
                <button
                    className="px-3 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md text-xs font-medium transition-colors"
                    onClick={() => onSelectNotification(n.id)}
                >
                    View Logs
                </button>
            ),
        },
    ];

    return (
        <div>
            {/* Sub-page header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Notifications — {campaignName}</h3>
                    <p className="text-sm text-gray-500">Campaign #{campaignId} · {totalCount} notification{totalCount !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-5 border border-gray-100">
                <div className="flex flex-wrap gap-3">
                    {/* Status */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="cnlStatus" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Status
                        </label>
                        <select
                            id="cnlStatus"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Scheduled From */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="cnlScheduledFrom" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Scheduled From
                        </label>
                        <input
                            id="cnlScheduledFrom"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={scheduledFromFilter}
                            onChange={(e) => { setScheduledFromFilter(e.target.value); resetPage(); }}
                        />
                    </div>

                    {/* Scheduled To */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="cnlScheduledTo" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Scheduled To
                        </label>
                        <input
                            id="cnlScheduledTo"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={scheduledToFilter}
                            onChange={(e) => { setScheduledToFilter(e.target.value); resetPage(); }}
                        />
                    </div>

                    {/* Clear */}
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

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="flex items-center gap-3 text-gray-500">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Loading notifications...
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">{error}</div>
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

            <ViewImageModal
                isOpen={imageModalOpen}
                onClose={() => { setImageModalOpen(false); setSelectedImageId(null); }}
                imageUrl={selectedImage}
                notificationId={selectedImageId}
            />
        </div>
    );
};

export default CampaignNotificationsList;
