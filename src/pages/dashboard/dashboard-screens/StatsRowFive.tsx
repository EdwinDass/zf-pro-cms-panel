// src/components/StatsRowFive/StatsRowFive.tsx

import React from "react";
import TopPerformers from "../dashboard-screens/TopPerformers";
import RegionalSalesGraph from "../dashboard-screens/regional-sales-graph";

const StatsRowFive: React.FC = () => {
  return (
    <div className="w-full mb-6">
      <RegionalSalesGraph />
    </div>
  );
};

export default StatsRowFive;

