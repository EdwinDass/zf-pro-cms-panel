import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getCategoryShare } from "../../../../services/ApiService";

interface CategoryShareItem {
    category: string;
    scanCount: number;
    percentage: number;
    formattedPercentage: string;
}

const COLOR_PALETTE = ["#1E64E2", "#F59E0B", "#10B981", "#8B5CF6", "#14B8A6", "#3B82F6", "#EC4899", "#6366F1"];

const CategorySharePieChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<CategoryShareItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getCategoryShare();
                const apiData = res?.data?.data?.categories;
                if (Array.isArray(apiData)) {
                    setCategories(apiData);
                }
            } catch (error) {
                console.error("Error fetching category share:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!chartRef.current || categories.length === 0) return;
        const chart = echarts.init(chartRef.current);

        const pieData = categories.map((item, idx) => ({
            name: item.category,
            value: item.percentage || item.scanCount,
            itemStyle: {
                color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
            },
        }));

        const option: echarts.EChartsOption = {
            tooltip: {
                trigger: "item",
                formatter: "{b}: <b>{c}%</b>",
            },
            legend: {
                orient: "vertical",
                right: "5%",
                top: "center",
                icon: "circle",
                itemGap: 12,
                formatter: (name: string) => {
                    const item = categories.find((c) => c.category === name);
                    const pct = item ? item.percentage : 0;
                    return `{name|${name}}  {pct|${pct}%}`;
                },
                textStyle: {
                    rich: {
                        name: {
                            color: "#475569",
                            fontSize: 13,
                            fontWeight: 500,
                        },
                        pct: {
                            color: "#0F172A",
                            fontSize: 13,
                            fontWeight: 700,
                        },
                    },
                },
            },
            series: [
                {
                    type: "pie",
                    radius: ["0%", "75%"],
                    center: ["35%", "50%"],
                    label: { show: false },
                    emphasis: {
                        scale: true,
                        scaleSize: 6,
                    },
                    data: pieData,
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
    }, [categories]);

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 w-full flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Category share</h2>

            {loading ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                    Loading category share...
                </div>
            ) : categories.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                    No category share data available
                </div>
            ) : (
                <div ref={chartRef} className="w-full h-72" />
            )}
        </div>
    );
};

export default CategorySharePieChart;
