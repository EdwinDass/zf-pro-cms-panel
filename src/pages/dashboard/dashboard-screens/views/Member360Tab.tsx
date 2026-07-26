import React, { useEffect, useState } from "react";
import { getMember360List, getMember360Detail } from "../../../../services/ApiService";

export interface MemberItem {
    userId: number;
    name: string;
    userCode: string;
    city: string;
    points: number;
    formattedPoints: string;
    healthScore: number;
    balancePoints: number;
    lifetimeRedeemed: string;
    lastActivity: string;
}

export interface TimelineItem {
    title: string;
    timeAgo: string;
    type: string;
}

const Member360TabContent: React.FC = () => {
    const [members, setMembers] = useState<MemberItem[]>([]);
    const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const res = await getMember360List(searchTerm);
                const apiData = res?.data?.data;
                if (Array.isArray(apiData) && apiData.length > 0) {
                    setMembers(apiData);
                    if (!selectedMember || !apiData.some(m => m.userId === selectedMember.userId)) {
                        setSelectedMember(apiData[0]);
                    }
                } else {
                    setMembers([]);
                    setSelectedMember(null);
                }
            } catch (error) {
                console.error("Error fetching member 360 list:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchMembers, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (!selectedMember) return;
        const fetchDetail = async () => {
            try {
                const res = await getMember360Detail(selectedMember.userId);
                const detailData = res?.data?.data;
                if (detailData && Array.isArray(detailData.timeline)) {
                    setTimeline(detailData.timeline);
                } else {
                    setTimeline([]);
                }
            } catch (error) {
                console.error("Error fetching member 360 detail:", error);
                setTimeline([]);
            }
        };

        fetchDetail();
    }, [selectedMember?.userId]);

    const getHealthColor = (score: number) => {
        if (score >= 70) return "text-emerald-600 font-bold";
        if (score >= 40) return "text-amber-600 font-bold";
        return "text-rose-600 font-bold";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── Left Column: Search & Master Member Table (7 cols) ── */}
            <div className="lg:col-span-7 bg-white shadow-md rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i className="fas fa-search text-sm"></i>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name, ID, mobile or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 placeholder-gray-400"
                    />
                </div>

                {/* Member Table */}
                {loading ? (
                    <div className="py-20 text-center text-gray-400 text-sm">
                        Loading member 360 data...
                    </div>
                ) : members.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-sm">
                        No members found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                                    <th className="pb-3 pl-2">Member</th>
                                    <th className="pb-3 text-right">Points</th>
                                    <th className="pb-3 pr-2 text-right">Health</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {members.map((m) => {
                                    const isSelected = selectedMember?.userId === m.userId;
                                    return (
                                        <tr
                                            key={m.userId}
                                            onClick={() => setSelectedMember(m)}
                                            className={`cursor-pointer transition-colors duration-150 hover:bg-blue-50/50 ${
                                                isSelected ? "bg-blue-50/80 font-medium" : ""
                                            }`}
                                        >
                                            {/* Member Name, ZF-ID & City */}
                                            <td className="py-3.5 pl-2">
                                                <div className="font-semibold text-gray-900 text-sm">
                                                    {m.name}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {m.userCode} · {m.city}
                                                </div>
                                            </td>

                                            {/* Points */}
                                            <td className="py-3.5 text-right font-semibold text-gray-800 text-sm">
                                                {m.formattedPoints || m.points.toLocaleString()}
                                            </td>

                                            {/* Health Score */}
                                            <td className="py-3.5 pr-2 text-right text-sm">
                                                <span className={getHealthColor(m.healthScore)}>
                                                    {m.healthScore}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Right Column: Member 360 Detail Card (5 cols) ── */}
            <div className="lg:col-span-5 bg-white shadow-md rounded-2xl p-6 border border-gray-100 flex flex-col justify-between space-y-6">
                {selectedMember ? (
                    <>
                        {/* Member Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                            <div className="flex items-center space-x-3.5">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center border border-blue-200">
                                    {selectedMember.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">
                                        {selectedMember.name}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {selectedMember.userCode} · {selectedMember.city}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 4 KPI Cards in 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <span className="text-xs font-medium text-gray-400 block mb-1">
                                    Points Balance
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    {selectedMember.formattedPoints || selectedMember.points.toLocaleString()}
                                </span>
                            </div>

                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <span className="text-xs font-medium text-gray-400 block mb-1">
                                    Health Score
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    {selectedMember.healthScore}/100
                                </span>
                            </div>

                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <span className="text-xs font-medium text-gray-400 block mb-1">
                                    Last Activity
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                    {selectedMember.lastActivity}
                                </span>
                            </div>

                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <span className="text-xs font-medium text-gray-400 block mb-1">
                                    Lifetime Redeemed
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    {selectedMember.lifetimeRedeemed}
                                </span>
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                                Activity Timeline
                            </h4>
                            {timeline.length === 0 ? (
                                <p className="text-gray-400 text-xs py-4 text-center">
                                    No recent activity recorded for this member
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {timeline.map((act, idx) => (
                                        <div key={idx} className="flex items-start space-x-3 text-xs">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{act.title}</p>
                                                <p className="text-gray-400 text-[11px] mt-0.5">{act.timeAgo}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="py-20 text-center text-gray-400 text-sm">
                        Select a member to view 360 details
                    </div>
                )}
            </div>
        </div>
    );
};

export default Member360TabContent;
