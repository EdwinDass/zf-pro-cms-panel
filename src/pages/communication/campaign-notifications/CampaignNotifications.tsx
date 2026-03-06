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

const CampaignNotifications: React.FC<CampaignNotificationsProps> = ({ onSelectCampaign }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const pageSize = 10;

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getCampaigns();
            if (res && res.success && Array.isArray(res.data)) {
                setCampaigns(res.data);
            } else {
                setError("Failed to load campaigns.");
            }
        } catch (err) {
            console.error("Failed to fetch campaigns:", err);
            setError("An error occurred while fetching campaigns.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

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
            inactive: "bg-gray-100 text-gray-600",
            paused: "bg-yellow-100 text-yellow-700",
            completed: "bg-blue-100 text-blue-700",
        };
        return colorMap[status.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const getRecurrenceColor = (recurrence: string): string => {
        const colorMap: Record<string, string> = {
            daily: "bg-purple-100 text-purple-700",
            weekly: "bg-orange-100 text-orange-700",
            monthly: "bg-teal-100 text-teal-700",
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
                    data={campaigns.slice((page - 1) * pageSize, page * pageSize)}
                    pageSize={pageSize}
                    totalRows={campaigns.length}
                    currentPage={page}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default CampaignNotifications;