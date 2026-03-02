import React, { useState, useMemo } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import ViewImageModal from "../components/ViewImageModal";

interface CampaignNotification {
    id: string;
    campaignName: string;
    app: string;
    title: string;
    description: string;
    image: string;
    redirection: string;
    startDate: string;
    endDate: string;
    sendTime: string;
    recurrenceType: "daily" | "weekly" | "monthly";
    weekDays?: string[];
    isActive: boolean;
    createdAt: string;
    errorMessage: string | null;
}

const CampaignNotifications: React.FC = () => {
    const [campaigns, setCampaigns] = useState<CampaignNotification[]>([
        {
            id: "1",
            campaignName: "Summer Sale 2026",
            app: "Mobile App",
            title: "Exclusive Summer Deals",
            description: "Get up to 50% off on all items",
            image: "summer-sale.jpg",
            redirection: "https://example.com/summer-sale",
            startDate: "2026-06-01",
            endDate: "2026-08-31",
            sendTime: "09:00",
            recurrenceType: "daily",
            weekDays: [],
            isActive: true,
            createdAt: "2026-02-01",
            errorMessage: null,
        },
        {
            id: "2",
            campaignName: "Weekly Updates",
            app: "Web App",
            title: "New Features Available",
            description: "Check out our latest updates",
            image: "updates.jpg",
            redirection: "https://example.com/updates",
            startDate: "2026-02-09",
            endDate: "2026-12-31",
            sendTime: "10:00",
            recurrenceType: "weekly",
            weekDays: ["Monday", "Wednesday", "Friday"],
            isActive: true,
            createdAt: "2026-01-15",
            errorMessage: null,
        },
        {
            id: "3",
            campaignName: "Monthly Newsletter",
            app: "Email",
            title: "February Newsletter",
            description: "Monthly digest of updates",
            image: "newsletter.jpg",
            redirection: "https://example.com/newsletter",
            startDate: "2026-02-01",
            endDate: "2026-02-28",
            sendTime: "08:00",
            recurrenceType: "monthly",
            weekDays: [],
            isActive: false,
            createdAt: "2026-01-20",
            errorMessage: "Image upload failed",
        },
    ]);

    // Filter states
    const [campaignNameFilter, setCampaignNameFilter] = useState<string>("");
    const [titleFilter, setTitleFilter] = useState<string>("");
    const [fromDateFilter, setFromDateFilter] = useState<string>("");
    const [toDateFilter, setToDateFilter] = useState<string>("");
    const [recurrenceTypeFilter, setRecurrenceTypeFilter] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const pageSize = 10;

    // Filtered data
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => {
            const matchCampaignName = campaign.campaignName
                .toLowerCase()
                .includes(campaignNameFilter.toLowerCase());
            const matchTitle = campaign.title.toLowerCase().includes(titleFilter.toLowerCase());

            const matchFromDate =
                !fromDateFilter || new Date(campaign.startDate) >= new Date(fromDateFilter);
            const matchToDate = !toDateFilter || new Date(campaign.endDate) <= new Date(toDateFilter);

            const matchRecurrence = !recurrenceTypeFilter || campaign.recurrenceType === recurrenceTypeFilter;

            return matchCampaignName && matchTitle && matchFromDate && matchToDate && matchRecurrence;
        });
    }, [campaigns, campaignNameFilter, titleFilter, fromDateFilter, toDateFilter, recurrenceTypeFilter]);

    const formatDate = (dateString: string): string => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const columns: Column[] = [
        {
            key: "campaignName",
            label: "Campaign Name",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-900">{campaign.campaignName}</div>
            ),
        },
        {
            key: "app",
            label: "App",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600">{campaign.app}</div>
            ),
        },
        {
            key: "title",
            label: "Title",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-900">{campaign.title}</div>
            ),
        },
        {
            key: "description",
            label: "Description",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600 text-sm">{campaign.description}</div>
            ),
        },
        {
            key: "image",
            label: "Image",
            render: (campaign: CampaignNotification) => (
                campaign.image ? (
                    <button
                        className="px-3 py-1 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md text-xs font-medium transition-colors"
                        onClick={() => {
                            setSelectedImage(campaign.image);
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
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600 text-sm truncate max-w-xs">{campaign.redirection}</div>
            ),
        },
        {
            key: "startDate",
            label: "Start Date",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600 text-sm">{formatDate(campaign.startDate)}</div>
            ),
        },
        {
            key: "endDate",
            label: "End Date",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600 text-sm">{formatDate(campaign.endDate)}</div>
            ),
        },
        {
            key: "sendTime",
            label: "Send Time",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600 text-sm">{campaign.sendTime}</div>
            ),
        },
        {
            key: "recurrenceType",
            label: "Recurrence Type",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600 capitalize">{campaign.recurrenceType}</div>
            ),
        },
        {
            key: "weekDays",
            label: "Weekdays",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600 text-sm">
                    {campaign.weekDays && campaign.weekDays.length > 0 ? campaign.weekDays.join(", ") : "-"}
                </div>
            ),
        },
        {
            key: "isActive",
            label: "Active",
            render: (campaign: CampaignNotification) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {campaign.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (campaign: CampaignNotification) => (
                <div className="text-gray-600 text-sm">{formatDate(campaign.createdAt)}</div>
            ),
        },
        {
            key: "errorMessage",
            label: "Error Message",
            render: (campaign: CampaignNotification) => (
                <div className="text-red-600 text-sm">{campaign.errorMessage || "N/A"}</div>
            ),
        },
    ];

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

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
                        <label htmlFor="campaignNameFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            Campaign Name
                        </label>
                        <input
                            id="campaignNameFilter"
                            type="text"
                            title="Filter by campaign name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Filter by campaign name..."
                            value={campaignNameFilter}
                            onChange={(e) => setCampaignNameFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="titleFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="titleFilter"
                            type="text"
                            title="Filter by title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Filter by title..."
                            value={titleFilter}
                            onChange={(e) => setTitleFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="recurrenceTypeFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            Recurrence Type
                        </label>
                        <select
                            id="recurrenceTypeFilter"
                            title="Filter by recurrence type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={recurrenceTypeFilter}
                            onChange={(e) => setRecurrenceTypeFilter(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="fromDateFilter" className="block mb-2 text-sm font-medium text-gray-700">
                            From Date
                        </label>
                        <input
                            id="fromDateFilter"
                            type="date"
                            title="Filter by start date"
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
                            title="Filter by end date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={toDateFilter}
                            onChange={(e) => setToDateFilter(e.target.value)}
                        />
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
            <CustomTable
                columns={columns}
                data={filteredCampaigns}
                pageSize={pageSize}
                totalRows={filteredCampaigns.length}
                currentPage={page}
                onPageChange={onPageChange}
            />

            {/* View Image Modal */}
            <ViewImageModal
                isOpen={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                imageUrl={selectedImage}
            />
        </div>
    );
};

export default CampaignNotifications;