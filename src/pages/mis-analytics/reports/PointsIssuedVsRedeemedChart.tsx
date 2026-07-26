import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getPointsIssuedVsRedeemedMonthly } from "../../../services/ApiService";

interface MonthlyPointsItem {
    month: string;
    issued: number;
    redeemed: number;
}

const PointsIssuedVsRedeemedChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<MonthlyPointsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getPointsIssuedVsRedeemedMonthly();
                const apiData = res?.data?.data;
                if (Array.isArray(apiData)) {
                    setData(apiData);
                }
            } catch (error) {
                console.error("Error fetching points issued vs redeemed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!chartRef.current || data.length === 0) return;
        const chart = echarts.init(chartRef.current);

        const months = data.map((d) => d.month);
        const issuedValues = data.map((d) => d.issued);
        const redeemedValues = data.map((d) => d.redeemed);

        const option: echarts.EChartsOption = {
            tooltip: {
                trigger: "axis",
            },
            legend: {
                bottom: "0%",
                left: "center",
                icon: "circle",
                itemGap: 24,
                textStyle: {
                    color: "#475569",
                    fontSize: 12,
                    fontWeight: 500,
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "12%",
                top: "10%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                data: months,
                boundaryGap: false,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: "#94A3B8",
                    fontSize: 12,
                },
            },
            yAxis: {
                type: "value",
                min: 0,
                max: 10,
                interval: 2.5,
                splitLine: {
                    lineStyle: {
                        color: "#F1F5F9",
                        type: "solid",
                    },
                },
                axisLabel: {
                    color: "#94A3B8",
                    fontSize: 12,
                },
            },
            series: [
                {
                    name: "Issued",
                    type: "line",
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 3,
                        color: "#1E64E2",
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(30, 100, 226, 0.25)" },
                            { offset: 1, color: "rgba(30, 100, 226, 0.02)" },
                        ]),
                    },
                    data: issuedValues,
                },
                {
                    name: "Redeemed",
                    type: "line",
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 3,
                        color: "#F59E0B",
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(245, 158, 11, 0.25)" },
                            { offset: 1, color: "rgba(245, 158, 11, 0.02)" },
                        ]),
                    },
                    data: redeemedValues,
                },
            ],
        };

        chart.setOption(option);

        const resizeObserver = new ResizeObserver(() => chart.resize());
        resizeObserver.observe(chartRef.current);

        return () => {
            chart.dispose();
            resizeObserver.disconnect();
        };
    }, [data]);

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
                Points issued vs redeemed (₹ Cr)
            </h2>

            {loading ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                    Loading points issued vs redeemed...
                </div>
            ) : data.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                    No data available
                </div>
            ) : (
                <div ref={chartRef} className="w-full h-72" />
            )}
        </div>
    );
};

export default PointsIssuedVsRedeemedChart;
