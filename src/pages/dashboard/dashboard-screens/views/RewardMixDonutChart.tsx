import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getMostRedeemedRewards } from "../../../../services/ApiService";

interface RewardItem {
    name: string;
    count: number;
    percentage: number;
    formattedPercentage: string;
}

const COLOR_PALETTE = ["#10B981", "#F59E0B", "#1E64E2", "#8B5CF6", "#14B8A6", "#EC4899", "#6366F1"];

interface Props {
    rewardsData?: RewardItem[];
}

const RewardMixDonutChart: React.FC<Props> = ({ rewardsData: propsData }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [rewards, setRewards] = useState<RewardItem[]>(propsData || []);
    const [loading, setLoading] = useState(!propsData);

    useEffect(() => {
        if (propsData && propsData.length > 0) {
            setRewards(propsData);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getMostRedeemedRewards(5);
                const apiData = res?.data?.data?.rewards;
                if (Array.isArray(apiData)) {
                    setRewards(apiData);
                }
            } catch (error) {
                console.error("Error fetching reward mix:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [propsData]);

    useEffect(() => {
        if (!chartRef.current || rewards.length === 0) return;
        const chart = echarts.init(chartRef.current);

        const pieData = rewards.map((item, idx) => ({
            name: item.name,
            value: item.percentage || item.count,
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
                itemGap: 14,
                formatter: (name: string) => {
                    const item = rewards.find((r) => r.name === name);
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
                    radius: ["52%", "75%"],
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
    }, [rewards]);

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 w-full flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Reward mix (share %)</h2>

            {loading ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                    Loading reward mix...
                </div>
            ) : rewards.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                    No reward mix data available
                </div>
            ) : (
                <div ref={chartRef} className="w-full h-72" />
            )}
        </div>
    );
};

export default RewardMixDonutChart;
