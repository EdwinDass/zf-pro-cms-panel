import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getSalesByCategory } from "../../../../services/ApiService";

interface CategorySalesChartProps {
    filters?: { [key: string]: any };
}

interface CategoryData {
    category: string;
    amount: number;
    formattedAmount?: string;
}

const CategorySalesChart: React.FC<CategorySalesChartProps> = ({ filters }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getSalesByCategory(filters);
                const apiData = res?.data?.data?.categories;
                if (Array.isArray(apiData)) {
                    setCategories(apiData);
                }
            } catch (error) {
                console.error("Error fetching category sales:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);

        const labels = categories.map((c) => c.category);
        const values = categories.map((c) => c.amount);

        const option: echarts.EChartsOption = {
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: (params: any) => {
                    const item = params[0];
                    return `<div className="font-sans">
                        <span className="font-semibold text-gray-800">${item.name}</span><br/>
                        Sales: <span className="font-bold text-blue-600">${item.value}</span>
                    </div>`;
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "10%",
                top: "12%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                data: labels,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 500,
                },
            },
            yAxis: {
                type: "value",
                splitLine: {
                    lineStyle: {
                        color: "#F1F5F9",
                        type: "dashed",
                    },
                },
                axisLabel: {
                    color: "#94A3B8",
                    fontSize: 12,
                },
            },
            series: [
                {
                    type: "bar",
                    data: values,
                    barWidth: "35%",
                    itemStyle: {
                        borderRadius: [8, 8, 0, 0],
                        color: (params: any) => {
                            // Colors: Blue for top bars, Coral Red for bottom 2
                            const total = values.length;
                            if (total > 3 && params.dataIndex >= total - 2) {
                                return "#F04438"; // Coral Red
                            }
                            return "#1E64E2"; // Vibrant Blue
                        },
                    },
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sales by product category (₹ Cr)
            </h2>

            {loading ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                    Loading category sales...
                </div>
            ) : categories.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                    No sales data available by category
                </div>
            ) : (
                <div ref={chartRef} className="w-full h-72" />
            )}
        </div>
    );
};

export default CategorySalesChart;
