// src/components/StatsRowFour/StatsRowFour.tsx

import React from "react";
import QuickActions from "../dashboard-screens/QuickActions";
import RecentTransactions from "../dashboard-screens/RecentTransactions";

const StatsRowFour: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch mb-6">

      {/* LEFT — Quick Actions (30%) */}
      <div className="w-full lg:w-[30%] flex flex-col">
        <div className="flex-1">
          <QuickActions />
        </div>
      </div>

      {/* RIGHT — Recent Transactions (70%) */}
      <div className="w-full lg:w-[70%] flex flex-col">
        <div className="flex-1">
          <RecentTransactions />
        </div>
      </div>

    </div>
  );
};

export default StatsRowFour;
