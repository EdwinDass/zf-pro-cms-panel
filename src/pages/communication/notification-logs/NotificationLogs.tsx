import React, { useState } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import ViewImageModal from "../components/ViewImageModal";

interface NotificationLog {
    id: number;
    userName: string;
    userMobile: string;
    userRole: string;
    country: string;
    app: string;
    notificationType: string;
    title: string;
    description: string;
    image: string | null;
    redirection: string;
    scheduledTime: string;
    sentAt: string | null;
    deliveredAt: string | null;
    readAt: string | null;
    clickCount: number;
    status: "Send" | "Failed" | "Read";
    createdAt: string;
    error: string | null;
}

interface NotificationLogsProps {
    notificationId: number | null;
}

const NotificationLogs: React.FC<NotificationLogsProps> = ({ notificationId }) => {
    const [userNameFilter, setUserNameFilter] = useState<string>("");
    const [userMobileFilter, setUserMobileFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const pageSize = 10;

    // Dummy data for notification logs
    const dummyLogs: NotificationLog[] = [
        {
            id: 1,
            userName: "John Doe",
            userMobile: "+1-555-0101",
            userRole: "Admin",
            country: "United States",
            app: "iOS",
            notificationType: "Campaign",
            title: "Special Offer",
            description: "Get 20% off on all products this week",
            image: "https://via.placeholder.com/150",
            redirection: "/products",
            scheduledTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            clickCount: 2,
            status: "Read",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            error: null,
        },
        {
            id: 2,
            userName: "Jane Smith",
            userMobile: "+1-555-0102",
            userRole: "Manager",
            country: "Canada",
            app: "Android",
            notificationType: "Manual",
            title: "System Update",
            description: "New features have been added",
            image: null,
            redirection: "/update-logs",
            scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            readAt: null,
            clickCount: 0,
            status: "Send",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            error: null,
        },
        {
            id: 3,
            userName: "Alice Johnson",
            userMobile: "+1-555-0103",
            userRole: "Agent",
            country: "United Kingdom",
            app: "Web",
            notificationType: "Scheduled",
            title: "Account Alert",
            description: "Unusual activity detected",
            image: "https://via.placeholder.com/150",
            redirection: "/security",
            scheduledTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: null,
            deliveredAt: null,
            readAt: null,
            clickCount: 0,
            status: "Failed",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            error: "Network timeout",
        },
        {
            id: 4,
            userName: "Bob Wilson",
            userMobile: "+1-555-0104",
            userRole: "User",
            country: "Australia",
            app: "iOS",
            notificationType: "Campaign",
            title: "Bonus Points",
            description: "You have earned 500 bonus points",
            image: "https://via.placeholder.com/150",
            redirection: "/rewards",
            scheduledTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            deliveredAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            readAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            clickCount: 1,
            status: "Read",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            error: null,
        },
        {
            id: 5,
            userName: "Carol Davis",
            userMobile: "+1-555-0105",
            userRole: "Manager",
            country: "Germany",
            app: "Android",
            notificationType: "Manual",
            title: "Event Available",
            description: "Join our upcoming webinar",
            image: "https://via.placeholder.com/150",
            redirection: "/events",
            scheduledTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            deliveredAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            readAt: null,
            clickCount: 0,
            status: "Send",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            error: null,
        },
    ];

    const [logs, setLogs] = useState<NotificationLog[]>(dummyLogs);
    const [totalCount, setTotalCount] = useState<number>(dummyLogs.length);

    // Filtered logs with status filter
    const filteredLogs = logs.filter((log) => {
        const matchUserName = log.userName.toLowerCase().includes(userNameFilter.toLowerCase());
        const matchUserMobile = log.userMobile.toLowerCase().includes(userMobileFilter.toLowerCase());
        const matchStatus = !statusFilter || log.status.toLowerCase() === statusFilter.toLowerCase();
        return matchUserName && matchUserMobile && matchStatus;
    });

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
            read: "bg-blue-100 text-blue-600",
        };
        return colorMap[status.toLowerCase()];
    };

    const columns: Column[] = [
        {
            key: "userName",
            label: "User Name",
            render: (log: NotificationLog) => (
                <div className="font-medium text-gray-900">{log.userName}</div>
            ),
        },
        {
            key: "userMobile",
            label: "User Mobile",
            render: (log: NotificationLog) => (
                <div className="text-gray-600">{log.userMobile}</div>
            ),
        },
        {
            key: "userRole",
            label: "User Role",
            render: (log: NotificationLog) => (
                <div className="text-gray-600">{log.userRole}</div>
            ),
        },
        {
            key: "country",
            label: "Country",
            render: (log: NotificationLog) => (
                <div className="text-gray-600">{log.country}</div>
            ),
        },
        {
            key: "app",
            label: "App",
            render: (log: NotificationLog) => (
                <div className="text-gray-600">{log.app}</div>
            ),
        },
        {
            key: "notificationType",
            label: "Notification Type",
            render: (log: NotificationLog) => (
                <div className="text-gray-600">{log.notificationType}</div>
            ),
        },
        {
            key: "title",
            label: "Title",
            render: (log: NotificationLog) => (
                <div className="font-medium text-gray-900">{log.title}</div>
            ),
        },
        {
            key: "description",
            label: "Description",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{log.description}</div>
            ),
        },
        {
            key: "image",
            label: "Image",
            render: (log: NotificationLog) => (
                log.image ? (
                    <button
                        className="px-3 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md text-xs font-medium transition-colors"
                        onClick={() => {
                            setSelectedImage(log.image);
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
            render: (log: NotificationLog) => (
                <div className="text-gray-600">{log.redirection}</div>
            ),
        },
        {
            key: "scheduledTime",
            label: "Scheduled Time",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{formatDate(log.scheduledTime)}</div>
            ),
        },
        {
            key: "sentAt",
            label: "Sent At",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{formatDate(log.sentAt)}</div>
            ),
        },
        {
            key: "deliveredAt",
            label: "Delivered At",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{formatDate(log.deliveredAt)}</div>
            ),
        },
        {
            key: "readAt",
            label: "Read At",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{formatDate(log.readAt)}</div>
            ),
        },
        {
            key: "clickCount",
            label: "Click Count",
            render: (log: NotificationLog) => (
                <div className="text-gray-600">{log.clickCount}</div>
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
            key: "createdAt",
            label: "Created At",
            render: (log: NotificationLog) => (
                <div className="text-gray-600 text-sm">{formatDate(log.createdAt)}</div>
            ),
        },
        {
            key: "error",
            label: "Error",
            render: (log: NotificationLog) => (
                <div className="text-red-600 text-sm">{log.error || "N/A"}</div>
            ),
        },
    ];

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (!notificationId) {
        return (
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 text-center">
                <p className="text-gray-600">Select a notification from history to view logs</p>
            </div>
        );
    }

    // Export handler (dummy for now)
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
                        <label htmlFor="userNameFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            User Name
                        </label>
                        <input
                            id="userNameFilter"
                            type="text"
                            title="Filter by user name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Filter by user name..."
                            value={userNameFilter}
                            onChange={(e) => setUserNameFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="userMobileFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            User Mobile
                        </label>
                        <input
                            id="userMobileFilter"
                            type="text"
                            title="Filter by user mobile"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Filter by user mobile..."
                            value={userMobileFilter}
                            onChange={(e) => setUserMobileFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="statusFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="statusFilter"
                            title="Filter by status"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="Send">Send</option>
                            <option value="Failed">Failed</option>
                            <option value="Read">Read</option>
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3" />
                    </svg>
                    Export
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-600">Loading notification logs...</div>
                </div>
            ) : (
                <CustomTable
                    columns={columns}
                    data={filteredLogs}
                    pageSize={pageSize}
                    totalRows={filteredLogs.length}
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

export default NotificationLogs;