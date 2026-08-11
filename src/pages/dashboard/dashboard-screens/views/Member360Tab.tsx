import React, { useEffect, useState } from "react";
import { getMember360List, getMember360Detail } from "../../../../services/ApiService";

export interface MemberItem {
    userId: number;
    name: string;
    userCode: string;
    city: string;
    mobile: string;
    points: number;
    formattedPoints: string;
    balancePoints: number;
    lifetimeRedeemed: string;
    lastActivity: string;
}

export interface TimelineItem {
    title: string;
    timeAgo: string;
    type: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const PAGE_SIZE = 10;

const getInitials = (name: string) => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

const AVATAR_COLORS = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-600",
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const MemberCard: React.FC<{
    member: MemberItem;
    selected: boolean;
    onClick: () => void;
    rank: number;
}> = ({ member, selected, onClick, rank }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150 border ${selected
                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
            }`}
    >
        <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor(member.userId)} flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm`}
        >
            {getInitials(member.name)}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
                {rank <= 3 && (
                    <span className={`text-xs font-bold ${rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : "text-amber-600"}`}>
                        #{rank}
                    </span>
                )}
                <p className={`text-sm font-semibold truncate ${selected ? "text-indigo-900" : "text-gray-900"}`}>
                    {member.name}
                </p>
            </div>
            <p className="text-xs text-gray-400 truncate mt-0.5">
                {member.userCode} &bull; {member.city}
            </p>
        </div>
        <div className="shrink-0 text-right">
            <p className={`text-sm font-bold ${selected ? "text-indigo-700" : "text-gray-700"}`}>
                {member.formattedPoints || member.points.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400">pts</p>
        </div>
    </div>
);

const KpiCard: React.FC<{ label: string; value: string; accent?: string }> = ({
    label,
    value,
    accent = "text-gray-900",
}) => (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-lg font-bold ${accent}`}>{value}</p>
    </div>
);

const Member360TabContent: React.FC = () => {
    const [members, setMembers] = useState<MemberItem[]>([]);
    const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const res = await getMember360List(searchTerm || undefined, currentPage, PAGE_SIZE);
                const apiData: MemberItem[] = res?.data?.data ?? [];
                const pag: Pagination = res?.data?.pagination ?? { total: 0, page: currentPage, limit: PAGE_SIZE, totalPages: 0 };
                setMembers(apiData);
                setPagination(pag);
                if (apiData.length > 0 && (!selectedMember || !apiData.some((m: MemberItem) => m.userId === selectedMember.userId))) {
                    setSelectedMember(apiData[0]);
                } else if (apiData.length === 0) {
                    setSelectedMember(null);
                }
            } catch (error) {
                console.error("Error fetching member 360 list:", error);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchMembers, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage]);

    useEffect(() => {
        if (!selectedMember) return;
        const fetchDetail = async () => {
            try {
                setDetailLoading(true);
                const res = await getMember360Detail(selectedMember.userId);
                const detailData = res?.data?.data;
                setTimeline(Array.isArray(detailData?.timeline) ? detailData.timeline : []);
            } catch (error) {
                console.error("Error fetching member 360 detail:", error);
                setTimeline([]);
            } finally {
                setDetailLoading(false);
            }
        };
        fetchDetail();
    }, [selectedMember?.userId]);

    const globalRank = (localIdx: number) => (currentPage - 1) * PAGE_SIZE + localIdx + 1;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left: Member List */}
            <div className="lg:col-span-7 bg-white shadow-sm rounded-2xl border border-gray-100 flex flex-col">
                <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Member 360</h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {pagination.total.toLocaleString()} members &bull; ranked by points
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, ID or city..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-gray-800 placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ maxHeight: "480px" }}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <svg className="animate-spin h-6 w-6 text-indigo-400 mb-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span className="text-sm">Loading members...</span>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="py-16 text-center text-gray-400">
                            <p className="text-sm font-medium">No members found</p>
                            {searchTerm && <p className="text-xs mt-1">Try a different search term</p>}
                        </div>
                    ) : (
                        members.map((m, idx) => (
                            <MemberCard
                                key={m.userId}
                                member={m}
                                selected={selectedMember?.userId === m.userId}
                                onClick={() => setSelectedMember(m)}
                                rank={globalRank(idx)}
                            />
                        ))
                    )}
                </div>

                {pagination.totalPages > 1 && (
                    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
                            >
                                &#8249;
                            </button>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const p = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition ${p === currentPage
                                                ? "bg-indigo-600 text-white border border-indigo-600"
                                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={currentPage === pagination.totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
                            >
                                &#8250;
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Detail Panel */}
            <div className="lg:col-span-5 bg-white shadow-sm rounded-2xl border border-gray-100 flex flex-col">
                {selectedMember ? (
                    <>
                        <div className={`bg-gradient-to-br ${avatarColor(selectedMember.userId)} px-6 py-5 rounded-t-2xl`}>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                    {getInitials(selectedMember.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-base truncate">{selectedMember.name}</h3>
                                    <p className="text-white text-opacity-80 text-xs mt-0.5">
                                        {selectedMember.userCode} &bull; {selectedMember.city}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 space-y-5 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-3">
                                <KpiCard
                                    label="Points Balance"
                                    value={selectedMember.formattedPoints || selectedMember.points.toLocaleString()}
                                    accent="text-indigo-700"
                                />
                                <KpiCard label="Last Activity" value={selectedMember.lastActivity} />
                                <KpiCard label="Lifetime Redeemed" value={selectedMember.lifetimeRedeemed} />
                                <KpiCard label="Mobile" value={selectedMember.mobile ?? "—"} />
                            </div>

                            {/* <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Activity Timeline
                                </h4>
                                {detailLoading ? (
                                    <div className="flex items-center gap-2 text-gray-400 py-4 text-sm">
                                        <svg className="animate-spin h-4 w-4 text-indigo-400" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Loading activity...
                                    </div>
                                ) : timeline.length === 0 ? (
                                    <p className="text-gray-400 text-xs py-4 text-center">No recent activity recorded</p>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute left-1.5 top-0 bottom-0 w-px bg-gray-100" />
                                        <div className="space-y-4 pl-6">
                                            {timeline.map((act, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-sm" />
                                                    <p className="text-sm font-semibold text-gray-800 leading-snug">{act.title}</p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">{act.timeAgo}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div> */}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">Select a member</p>
                        <p className="text-xs mt-1">Click any member to view their 360 details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Member360TabContent;
