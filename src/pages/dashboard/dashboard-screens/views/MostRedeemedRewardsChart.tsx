import React, { useEffect, useState } from "react";
import { getMostRedeemedRewards } from "../../../../services/ApiService";

export interface RewardItem {
    rank: number;
    name: string;
    mode: string;
    count: number;
    formattedCount: string;
    points: number;
    percentage: number;
    formattedPercentage: string;
}

const BAR_COLORS = ["#10B981", "#F59E0B", "#1E64E2", "#8B5CF6", "#14B8A6", "#EC4899", "#6366F1"];

const MostRedeemedRewardsChart: React.FC<{
    onDataLoaded?: (rewards: RewardItem[]) => void;
}> = ({ onDataLoaded }) => {
    const [rewards, setRewards] = useState<RewardItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getMostRedeemedRewards(5);
                const apiData = res?.data?.data?.rewards;
                if (Array.isArray(apiData)) {
                    setRewards(apiData);
                    if (onDataLoaded) onDataLoaded(apiData);
                }
            } catch (error) {
                console.error("Error fetching most redeemed rewards:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [onDataLoaded]);

    const maxCount = Math.max(...rewards.map((r) => r.count || 0), 1);

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 w-full flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Most redeemed rewards</h2>

            {loading ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    Loading most redeemed rewards...
                </div>
            ) : rewards.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    No reward redemption data available
                </div>
            ) : (
                <div className="space-y-4 my-auto">
                    {rewards.map((item, idx) => {
                        const pct = Math.min(Math.max((item.count / maxCount) * 100, 4), 100);
                        const barColor = BAR_COLORS[idx % BAR_COLORS.length];

                        return (
                            <div key={item.name || idx} className="flex items-center text-sm">
                                {/* Category Name Label */}
                                <span className="w-44 text-right font-medium text-gray-700 pr-4 shrink-0 truncate">
                                    {item.name}
                                </span>

                                {/* Bar Track and Filled Bar */}
                                <div className="flex-1 bg-[#F1F5F9] h-10 rounded-xl overflow-hidden relative flex items-center">
                                    <div
                                        className="h-full rounded-xl transition-all duration-500 ease-out flex items-center justify-end pr-3"
                                        style={{ width: `${pct}%`, backgroundColor: barColor }}
                                    >
                                        <span className="text-xs font-semibold text-white">
                                            {item.formattedCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MostRedeemedRewardsChart;
