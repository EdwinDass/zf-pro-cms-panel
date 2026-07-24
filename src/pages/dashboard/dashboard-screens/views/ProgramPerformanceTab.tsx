import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getUserRegistrations, getKycStatus, getUserStatusDistribution } from "../../../../services/ApiService";

// ─────────────────────────────────────────────
// Reusable ECharts Pie / Donut
// ─────────────────────────────────────────────
interface PieData { name: string; value: number; color: string; }

const DonutChart: React.FC<{ data: PieData[]; height?: string }> = ({ data, height = "220px" }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const chart = echarts.init(ref.current);
        chart.setOption({
            tooltip: {
                trigger: "item",
                formatter: "{b}: {c} ({d}%)"
            },
            legend: { show: false },
            series: [{
                type: "pie",
                radius: "72%",
                avoidLabelOverlap: true,
                itemStyle: { borderColor: "#fff", borderWidth: 2 },
                label: {
                    show: true,
                    formatter: "{d}%",
                    fontSize: 12,
                    color: "#fff",
                    position: "inside",
                    fontWeight: "bold"
                },
                emphasis: {
                    label: { show: true, fontSize: 14, fontWeight: "bold" }
                },
                data: data.map(d => ({
                    name: d.name,
                    value: d.value,
                    itemStyle: { color: d.color }
                }))
            }]
        });
        const ro = new ResizeObserver(() => chart.resize());
        ro.observe(ref.current);
        return () => { chart.dispose(); ro.disconnect(); };
    }, [data]);

    return <div ref={ref} style={{ width: "100%", height }} />;
};

// ─────────────────────────────────────────────
// Reusable ECharts Line Graph (only active + MAU)
// ─────────────────────────────────────────────
interface LineData { labels: string[]; active: number[]; mau: number[]; }

const ActiveMauLineChart: React.FC<{ data: LineData }> = ({ data }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const chart = echarts.init(ref.current);
        chart.setOption({
            tooltip: { trigger: "axis" },
            legend: {
                bottom: 0,
                icon: "circle",
                itemWidth: 10,
                itemHeight: 10,
                textStyle: { color: "#4B5563", fontSize: 12 }
            },
            grid: { left: "3%", right: "4%", top: "10%", bottom: "15%", containLabel: true },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: data.labels,
                axisLine: { lineStyle: { color: "#E5E7EB" } },
                axisLabel: { color: "#6B7280" }
            },
            yAxis: {
                type: "value",
                splitLine: { lineStyle: { color: "#F3F4F6" } },
                axisLabel: {
                    color: "#6B7280",
                    formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)
                }
            },
            series: [
                {
                    name: "Active Users",
                    data: data.active,
                    type: "line",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 6,
                    itemStyle: { color: "#10B981" },
                    lineStyle: { width: 2.5, color: "#10B981" },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(16,185,129,0.18)" },
                            { offset: 1, color: "rgba(16,185,129,0.01)" }
                        ])
                    }
                },
                {
                    name: "Monthly Active Users",
                    data: data.mau,
                    type: "line",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 6,
                    itemStyle: { color: "#F59E0B" },
                    lineStyle: { width: 2.5, color: "#F59E0B" }
                }
            ]
        }, true);
        const ro = new ResizeObserver(() => chart.resize());
        ro.observe(ref.current);
        return () => { chart.dispose(); ro.disconnect(); };
    }, [data]);

    return <div ref={ref} className="w-full h-64" />;
};

// ─────────────────────────────────────────────
// Legend pill
// ─────────────────────────────────────────────
const Legend: React.FC<{ items: { label: string; color: string; value: number }[] }> = ({ items }) => {
    const total = items.reduce((s, i) => s + i.value, 0);
    return (
        <div className="flex flex-col gap-2 mt-2">
            {items.map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-gray-600">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{item.value.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 w-10 text-right">
                            {total > 0 ? `${Math.round((item.value / total) * 100)}%` : "—"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────
// Main ProgramPerformanceTab
// ─────────────────────────────────────────────
const RANGE_OPTIONS = [
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 3 months", value: "90" },
    { label: "FY 2025–26", value: "FY_2025_2026" },
];

const buildParams = (v: string) => {
    if (v === "7") return { range: "last7" };
    if (v === "30") return { range: "last30" };
    if (v === "90") return { range: "3months" };
    if (v.startsWith("FY_")) return { range: "fy", financialYear: v.replace("FY_", "").replace("_", "-") };
    return { range: "last7" };
};

const ProgramPerformanceTab: React.FC = () => {
    // ── Line chart state ──
    const [lineRange, setLineRange] = useState("7");
    const [lineData, setLineData] = useState<LineData>({ labels: [], active: [], mau: [] });
    const [lineLoading, setLineLoading] = useState(true);

    // ── User status pie state ──
    const [userStatus, setUserStatus] = useState({ active: 0, inactive: 0, dormant: 0 });
    const [userStatusLoading, setUserStatusLoading] = useState(true);

    // ── KYC status pie state ──
    const [kycStatus, setKycStatus] = useState({ approved: 0, pending: 0, rejected: 0 });
    const [kycLoading, setKycLoading] = useState(true);

    // Fetch line chart
    useEffect(() => {
        setLineLoading(true);
        getUserRegistrations(buildParams(lineRange))
            .then(res => {
                const d = res?.data?.data || res?.data || {};
                setLineData({
                    labels: d.labels || [],
                    active: d.active || [],
                    mau: d.mau || []
                });
            })
            .catch(() => setLineData({ labels: [], active: [], mau: [] }))
            .finally(() => setLineLoading(false));
    }, [lineRange]);

    // Fetch user status distribution
    useEffect(() => {
        setUserStatusLoading(true);
        getUserStatusDistribution()
            .then(res => {
                const d = res?.data?.data || {};
                setUserStatus({
                    active: d.active ?? 0,
                    inactive: d.inactive ?? 0,
                    dormant: d.dormant ?? 0
                });
            })
            .catch(() => setUserStatus({ active: 0, inactive: 0, dormant: 0 }))
            .finally(() => setUserStatusLoading(false));
    }, []);

    // Fetch KYC status
    useEffect(() => {
        setKycLoading(true);
        getKycStatus({})
            .then(res => {
                const d = res?.data?.data || {};
                setKycStatus({
                    approved: d.approved ?? 0,
                    pending: d.pending ?? 0,
                    rejected: d.rejected ?? 0
                });
            })
            .catch(() => setKycStatus({ approved: 0, pending: 0, rejected: 0 }))
            .finally(() => setKycLoading(false));
    }, []);

    // Derived pie data
    const userStatusPie: PieData[] = [
        { name: "Active", value: userStatus.active, color: "#10B981" },
        { name: "Inactive", value: userStatus.inactive, color: "#F59E0B" },
        { name: "Dormant", value: userStatus.dormant, color: "#EF4444" },
    ];

    const kycStatusPie: PieData[] = [
        { name: "Verified", value: kycStatus.approved, color: "#10B981" },
        { name: "Pending", value: kycStatus.pending, color: "#3B82F6" },
        { name: "Rejected", value: kycStatus.rejected, color: "#EF4444" },
    ];

    const Spinner = () => (
        <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">

            {/* ── Row 1: Active Users & MAU Line Chart ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Member Growth &amp; Engagement</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Active Users and Monthly Active Users over time</p>
                    </div>
                    <select
                        value={lineRange}
                        onChange={e => setLineRange(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    >
                        {RANGE_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
                {lineLoading ? <Spinner /> : <ActiveMauLineChart data={lineData} />}
                <div className="flex gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span className="w-3 h-3 rounded-full" style={{ background: "#10B981" }} />
                        Active Users
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
                        Monthly Active Users (MAU)
                    </div>
                </div>
            </div>

            {/* ── Row 2: Two Pie Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* User Status Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">User Status Distribution</h2>
                    <p className="text-xs text-gray-400 mb-4">Active / Inactive / Dormant members</p>
                    {userStatusLoading ? (
                        <Spinner />
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-shrink-0 w-full sm:w-48">
                                <DonutChart data={userStatusPie} height="200px" />
                            </div>
                            <div className="flex-1 w-full">
                                <Legend items={userStatusPie.map(p => ({ label: p.name, color: p.color, value: p.value }))} />
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">Total Members</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {(userStatus.active + userStatus.inactive + userStatus.dormant).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* KYC Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">KYC Status</h2>
                    <p className="text-xs text-gray-400 mb-4">Verified / Pending / Rejected members</p>
                    {kycLoading ? (
                        <Spinner />
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-shrink-0 w-full sm:w-48">
                                <DonutChart data={kycStatusPie} height="200px" />
                            </div>
                            <div className="flex-1 w-full">
                                <Legend items={kycStatusPie.map(p => ({ label: p.name, color: p.color, value: p.value }))} />
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">Total KYC Records</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {(kycStatus.approved + kycStatus.pending + kycStatus.rejected).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProgramPerformanceTab;
