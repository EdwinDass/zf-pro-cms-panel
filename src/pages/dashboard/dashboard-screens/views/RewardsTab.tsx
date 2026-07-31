import React, { useEffect, useState } from "react";
import MostRedeemedRewardsChart, { RewardItem } from "./MostRedeemedRewardsChart";
import RewardMixDonutChart from "./RewardMixDonutChart";
import Card from "../Card";
import { FaGift, FaCoins, FaDollarSign, FaBoxOpen } from "react-icons/fa";
import { getRewardsStats } from "../../../../services/ApiService";

const RewardsTabContent: React.FC = () => {
    const [rewardsData, setRewardsData] = useState<RewardItem[]>([]);
    const [stats, setStats] = useState({
        totalRedemptions: 0,
        avgRedemptionValue: 0,
        rewardCost: 0,
        inactiveSkus: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRewardsStats()
            .then((res) => {
                const d = res?.data?.data || {};
                setStats({
                    totalRedemptions: d.totalRedemptions ?? 0,
                    avgRedemptionValue: d.avgRedemptionValue ?? 0,
                    rewardCost: d.rewardCost ?? 0,
                    inactiveSkus: d.inactiveSkus ?? 0
                });
            })
            .catch((err) => console.error("Rewards stats error:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            {/* Top row: 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Total Redemptions"
                    value={loading ? "..." : stats.totalRedemptions.toLocaleString()}
                    percentage="Claimed Rewards"
                    percentageColor="text-purple-600"
                    icon={<FaGift />}
                    iconColor="text-purple-500"
                />
                <Card
                    title="Avg Redemption Value"
                    value={loading ? "..." : stats.avgRedemptionValue.toLocaleString()}
                    percentage="Points / Claim"
                    percentageColor="text-blue-600"
                    icon={<FaCoins />}
                    iconColor="text-blue-500"
                />
                <Card
                    title="Reward Cost"
                    value={loading ? "..." : stats.rewardCost.toLocaleString()}
                    percentage="Total Points Redeemed"
                    percentageColor="text-amber-600"
                    icon={<FaDollarSign />}
                    iconColor="text-amber-500"
                />
                <Card
                    title="Inactive SKUs"
                    value={loading ? "..." : stats.inactiveSkus.toLocaleString()}
                    percentage="Inactive Items"
                    percentageColor="text-gray-600"
                    icon={<FaBoxOpen />}
                    iconColor="text-gray-400"
                />
            </div>

            {/* Middle row: Most redeemed rewards & Reward mix side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MostRedeemedRewardsChart onDataLoaded={setRewardsData} />
                <RewardMixDonutChart rewardsData={rewardsData} />
            </div>
        </div>
    );
};

export default RewardsTabContent;
