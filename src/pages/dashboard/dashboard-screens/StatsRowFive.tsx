// src/components/StatsRowFive/StatsRowFive.tsx

import React from "react";
import TopPerformers from "../dashboard-screens/TopPerformers";

const StatsRowFive: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* Top Performers — 40% width on large screens */}
      <div className="w-full lg:w-[40%]">
        <TopPerformers />
      </div>

    </div>
  );
};

export default StatsRowFive;
