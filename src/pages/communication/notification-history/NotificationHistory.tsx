import React, { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import CustomTable, { Column } from "../../../components/CustomTable";
import ViewImageModal from "../components/ViewImageModal";

interface NotificationHistoryProps {
    onSelectNotification?: (id: number) => void;
}

interface Notification {
    id: number;
    notificationType: string;
    title: string;
    description: string;
    image: string | null;
    redirection: string;
    sentAt: string;
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

    // Dummy data
    const dummyNotifications: Notification[] = [
        {
            id: 1,
            notificationType: "Campaign",
            title: "Special Offer",
            description: "Get 20% off on all products this week",
            image: "https://via.placeholder.com/150",
            redirection: "/products",
            sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Send",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 2,
            notificationType: "Manual",
            title: "System Update",
            description: "New features have been added to the platform",
            image: null,
            redirection: "/update-logs",
            sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Send",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 3,
            notificationType: "Scheduled",
            title: "Account Alert",
            description: "Unusual activity detected on your account",
            image: "https://via.placeholder.com/150",
            redirection: "/security",
            sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            status: "Send",
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 4,
            notificationType: "Campaign",
            title: "Bonus Points Awarded",
            description: "You have earned 500 bonus points",
            image: "https://via.placeholder.com/150",
            redirection: "/rewards",
            sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            status: "Failed",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 5,
            notificationType: "Manual",
            title: "New Event Available",
            description: "Join our upcoming webinar on digital marketing",
            image: "https://via.placeholder.com/150",
            redirection: "/events",
            sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: "Send",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 6,
            notificationType: "Scheduled",
            title: "Flash Sale",
            description: "Limited time offer: Buy one get one free",
            image: "https://via.placeholder.com/150",
            redirection: "/sales",
            sentAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
            status: "Send",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 7,
            notificationType: "Campaign",
            title: "Maintenance Notice",
            description: "Server maintenance scheduled for tonight",
            image: null,
            redirection: "/maintenance",
            sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            status: "Send",
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 8,
            notificationType: "Manual",
            title: "Expiry Warning",
            description: "Your membership expires in 7 days",
            image: null,
            redirection: "/membership",
            sentAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
            status: "Failed",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 9,
            notificationType: "Scheduled",
            title: "Referral Bonus",
            description: "Earn rewards by referring friends",
            image: "https://via.placeholder.com/150",
            redirection: "/referral",
            sentAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            status: "Send",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 10,
            notificationType: "Campaign",
            title: "Workshop Registration",
            description: "Register now for our exclusive workshop",
            image: "https://via.placeholder.com/150",
            redirection: "/workshops",
            sentAt: new Date(Date.now() - 84 * 60 * 60 * 1000).toISOString(),
            status: "Failed",
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
    const [totalCount, setTotalCount] = useState<number>(dummyNotifications.length);

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
        };
        return colorMap[status.toLowerCase()];
    };

    const getTypeColor = (type: string): string => {
        const colorMap: Record<string, string> = {
            manual: "bg-blue-100 text-blue-600",
            campaign: "bg-purple-100 text-purple-600",
            scheduled: "bg-orange-100 text-orange-600",
        };
        return colorMap[type.toLowerCase()];
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
            {/* Filter Section */}
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

            {/* Export Button */}
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