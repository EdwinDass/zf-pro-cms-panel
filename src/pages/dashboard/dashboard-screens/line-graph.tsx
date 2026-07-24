// src/components/LineGraph/LineGraph.tsx

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface LineGraphProps {
    labels: string[];         // ['Mon', 'Tue', ...]
    registered?: number[];    // Registered users count array
    active?: number[];        // Active users count array
    mau?: number[];           // Monthly active users count array
    values?: number[];        // Fallback array for single series
}

const LineGraph: React.FC<LineGraphProps> = ({
    labels,
    registered = [],
    active = [],
    mau = [],
    values = []
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);

        const seriesData: any[] = [];

        // Blue line for Registered Users
        const regData = registered.length ? registered : values;
        if (regData.length) {
            seriesData.push({
                name: "Registered",
                data: regData,
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 6,
                itemStyle: { color: "#2563EB" },
                lineStyle: { width: 2.5, color: "#2563EB" },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(37, 99, 235, 0.15)" },
                        { offset: 1, color: "rgba(37, 99, 235, 0.01)" }
                    ])
                }
            });
        }

        // Green line for Active Users
        if (active.length) {
            seriesData.push({
                name: "Active",
                data: active,
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 6,
                itemStyle: { color: "#10B981" },
                lineStyle: { width: 2.5, color: "#10B981" }
            });
        }

        // Orange line for MAU
        if (mau.length) {
            seriesData.push({
                name: "MAU",
                data: mau,
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 6,
                itemStyle: { color: "#F59E0B" },
                lineStyle: { width: 2.5, color: "#F59E0B" }
            });
        }

        const option = {
            tooltip: {
                trigger: "axis",
            },
            legend: {
                bottom: 0,
                icon: "circle",
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    color: "#4B5563",
                    fontSize: 12
                }
            },
            grid: {
                left: "3%",
                right: "4%",
                top: "10%",
                bottom: "15%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: labels,
                axisLine: { lineStyle: { color: "#E5E7EB" } },
                axisLabel: { color: "#6B7280" }
            },
            yAxis: {
                type: "value",
                splitLine: { lineStyle: { color: "#F3F4F6" } },
                axisLabel: {
                    color: "#6B7280",
                    formatter: (val: number) => {
                        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
                        return val;
                    }
                }
            },
            series: seriesData
        };

        chart.setOption(option, true);

        // Auto-resize
        const resizeObserver = new ResizeObserver(() => chart.resize());
        resizeObserver.observe(chartRef.current);

        return () => {
            chart.dispose();
            resizeObserver.disconnect();
        };
    }, [labels, registered, active, mau, values]);

    return <div ref={chartRef} className="w-full h-64" />;
};

export default LineGraph;

