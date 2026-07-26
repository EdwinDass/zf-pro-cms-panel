import React, { useState } from "react";
import MostRedeemedRewardsChart, { RewardItem } from "./MostRedeemedRewardsChart";
import RewardMixDonutChart from "./RewardMixDonutChart";

const RewardsTabContent: React.FC = () => {
    const [rewardsData, setRewardsData] = useState<RewardItem[]>([]);

    return (
        <div className="space-y-6">
            {/* Top row: Most redeemed rewards & Reward mix side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MostRedeemedRewardsChart onDataLoaded={setRewardsData} />
                <RewardMixDonutChart rewardsData={rewardsData} />
            </div>
        </div>
    );
};

export default RewardsTabContent;
