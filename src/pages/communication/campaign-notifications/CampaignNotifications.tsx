import React, { useState, useEffect, useCallback } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import { getCampaigns } from "../../../services/ApiService";

interface Campaign {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    scheduledTime: string;
    recurrence: string;
    status: string;
    createdAt: string;
}

interface CampaignNotificationsProps {
    onSelectCampaign: (id: number, name: string) => void;
}

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
];

const RECURRENCE_OPTIONS = [
    { value: "", label: "All Recurrences" },
    { value: "HOURLY", label: "Hourly" },
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
];

const CampaignNotifications: React.FC<CampaignNotificationsProps> = ({ onSelectCampaign }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const pageSize = 10;

    // Filters
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [recurrenceFilter, setRecurrenceFilter] = useState<string>("");
    const [startFromFilter, setStartFromFilter] = useState<string>("");
    const [startToFilter, setStartToFilter] = useState<string>("");
    const [endFromFilter, setEndFromFilter] = useState<string>("");
    const [endToFilter, setEndToFilter] = useState<string>("");

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getCampaigns(page, pageSize, {
                status: statusFilter || undefined,
                recurrence: recurrenceFilter || undefined,
                search: searchFilter || undefined,
                startFrom: startFromFilter || undefined,
                startTo: startToFilter || undefined,
                endFrom: endFromFilter || undefined,
                endTo: endToFilter || undefined,
            });
            if (res && res.success && Array.isArray(res.data)) {
                setCampaigns(res.data);
                setTotalCount(res.total || 0);
            } else {
                setError("Failed to load campaigns.");
            }
        } catch (err) {
            console.error("Failed to fetch campaigns:", err);
            setError("An error occurred while fetching campaigns.");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, searchFilter, statusFilter, recurrenceFilter, startFromFilter, startToFilter, endFromFilter, endToFilter]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const resetPage = () => setPage(1);

    const handleClearFilters = () => {
        setSearchFilter("");
        setStatusFilter("");
        setRecurrenceFilter("");
        setStartFromFilter("");
        setStartToFilter("");
        setEndFromFilter("");
        setEndToFilter("");
        setPage(1);
    };

    const hasActiveFilters = searchFilter || statusFilter || recurrenceFilter || startFromFilter || startToFilter || endFromFilter || endToFilter;

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string): string => {
        const colorMap: Record<string, string> = {
            active: "bg-green-100 text-green-700",
            completed: "bg-blue-100 text-blue-700",
            cancelled: "bg-red-100 text-red-600",
            inactive: "bg-gray-100 text-gray-600",
        };
        return colorMap[status.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const getRecurrenceColor = (recurrence: string): string => {
        const colorMap: Record<string, string> = {
            hourly: "bg-teal-100 text-teal-700",
            daily: "bg-purple-100 text-purple-700",
            weekly: "bg-orange-100 text-orange-700",
            monday: "bg-blue-100 text-blue-700",
            tuesday: "bg-blue-100 text-blue-700",
            wednesday: "bg-blue-100 text-blue-700",
            thursday: "bg-blue-100 text-blue-700",
            friday: "bg-blue-100 text-blue-700",
            saturday: "bg-indigo-100 text-indigo-700",
            sunday: "bg-indigo-100 text-indigo-700",
        };
        return colorMap[recurrence.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const columns: Column[] = [
        {
            key: "id",
            label: "ID",
            render: (campaign: Campaign) => (
                <div className="text-gray-400 text-sm font-mono">#{campaign.id}</div>
            ),
        },
        {
            key: "name",
            label: "Campaign Name",
            render: (campaign: Campaign) => (
                <div className="font-semibold text-gray-900">{campaign.name}</div>
            ),
        },
        {
            key: "recurrence",
            label: "Recurrence",
            render: (campaign: Campaign) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRecurrenceColor(campaign.recurrence)}`}>
                    {campaign.recurrence}
                </span>
            ),
        },
        {
            key: "scheduledTime",
            label: "Scheduled Time",
            render: (campaign: Campaign) => (
                <div className="text-gray-700 font-mono text-sm">{campaign.scheduledTime}</div>
            ),
        },
        {
            key: "startDate",
            label: "Start Date",
            render: (campaign: Campaign) => (
                <div className="text-gray-600 text-sm">{formatDate(campaign.startDate)}</div>
            ),
        },
        {
            key: "endDate",
            label: "End Date",
            render: (campaign: Campaign) => (
                <div className="text-gray-600 text-sm">{formatDate(campaign.endDate)}</div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (campaign: Campaign) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (campaign: Campaign) => (
                <div className="text-gray-600 text-sm">{formatDate(campaign.createdAt)}</div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (campaign: Campaign) => (
                <button
                    onClick={() => onSelectCampaign(campaign.id, campaign.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    View Notifications
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
                        <label htmlFor="campaignSearch" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Search
                        </label>
                        <input
                            id="campaignSearch"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Search campaign name..."
                            value={searchFilter}
                            onChange={(e) => { setSearchFilter(e.target.value); resetPage(); }}
                        />
                    </div>

                    {/* Status */}
                    <div className="flex-1 min-w-[150px]">
                        <label htmlFor="campaignStatus" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Status
                        </label>
                        <select
                            id="campaignStatus"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Recurrence */}
                    <div className="flex-1 min-w-[160px]">
                        <label htmlFor="campaignRecurrence" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Recurrence
                        </label>
                        <select
                            id="campaignRecurrence"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            value={recurrenceFilter}
                            onChange={(e) => { setRecurrenceFilter(e.target.value); resetPage(); }}
                        >
                            {RECURRENCE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Start From */}
                    <div className="flex-1 min-w-[150px]">
                        <label htmlFor="startFrom" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Start From
                        </label>
                        <input
                            id="startFrom"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={startFromFilter}
                            onChange={(e) => { setStartFromFilter(e.target.value); resetPage(); }}
                        />
                    </div>

                    {/* Start To */}
                    <div className="flex-1 min-w-[150px]">
                        <label htmlFor="startTo" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Start To
                        </label>
                        <input
                            id="startTo"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={startToFilter}
                            onChange={(e) => { setStartToFilter(e.target.value); resetPage(); }}
                        />
                    </div>

                    {/* End From */}
                    <div className="flex-1 min-w-[150px]">
                        <label htmlFor="endFrom" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            End From
                        </label>
                        <input
                            id="endFrom"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={endFromFilter}
                            onChange={(e) => { setEndFromFilter(e.target.value); resetPage(); }}
                        />
                    </div>

                    {/* End To */}
                    <div className="flex-1 min-w-[150px]">
                        <label htmlFor="endTo" className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            End To
                        </label>
                        <input
                            id="endTo"
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={endToFilter}
                            onChange={(e) => { setEndToFilter(e.target.value); resetPage(); }}
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
                        Loading campaigns...
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">{error}</div>
            ) : (
                <CustomTable
                    columns={columns}
                    data={campaigns}
                    pageSize={pageSize}
                    totalRows={totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default CampaignNotifications;