// src/components/StatsRowThree/StatsRowThree.tsx

import React, { useState } from "react";
import LineGraph from "../dashboard-screens/line-graph";
import BarGraph from "../dashboard-screens/bar-graph";

const StatsRowThree: React.FC = () => {
  // Dropdown states
  const [lineRange, setLineRange] = useState("7");
  const [barRange, setBarRange] = useState("6");

  // ---------------------------------------------
  // LINE GRAPH DATA (you can change based on range)
  // ---------------------------------------------
  const lineLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const lineValues = [58, 78, 40, 42, 46, 45, 62];

  // ---------------------------------------------
  // BAR GRAPH DATA (you can later change based on range)
  // ---------------------------------------------
  const barLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const barA = [120, 200, 150, 80, 70, 110];
  const barB = [90, 160, 110, 60, 40, 95];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* LEFT — Line Chart */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Member Growth
          </h2>

          {/* Line graph dropdown */}
          <select
            value={lineRange}
            onChange={(e) => setLineRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last 1 year</option>
          </select>
        </div>

        <LineGraph labels={lineLabels} values={lineValues} />
      </div>

      {/* RIGHT — Bar Chart */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Points Transactions
          </h2>

          {/* Bar graph dropdown */}
          <select
            value={barRange}
            onChange={(e) => setBarRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last 1 year</option>
          </select>
        </div>

        <BarGraph labels={barLabels} datasetA={barA} datasetB={barB} />
      </div>

    </div>
  );
};

export default StatsRowThree;
