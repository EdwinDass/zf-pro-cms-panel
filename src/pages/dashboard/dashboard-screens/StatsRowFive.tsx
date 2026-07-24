// src/components/StatsRowFive/StatsRowFive.tsx

import React from "react";
import TopPerformers from "../dashboard-screens/TopPerformers";
import RegionalSalesGraph from "../dashboard-screens/regional-sales-graph";

const StatsRowFive: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-6">

      {/* Top Performers — 40% width on large screens */}
      <div className="w-full lg:w-[40%] flex flex-col">
        <TopPerformers />
      </div>

      {/* Regional Sales Performance — 60% width on large screens */}
      <div className="w-full lg:w-[60%] flex flex-col">
        <RegionalSalesGraph />
      </div>

    </div>
  );
};

export default StatsRowFive;

