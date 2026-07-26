// src/components/StatsRowThree/StatsRowThree.tsx

import React, { useEffect, useState } from "react";
import LineGraph from "../dashboard-screens/line-graph";
import BarGraph from "../dashboard-screens/bar-graph";
import { getUserRegistrations, getPointsGraph } from "../../../services/ApiService";

const StatsRowThree: React.FC = () => {
  // Dropdown state
  const [lineRange, setLineRange] = useState("7");
  const [barRange, setBarRange] = useState("7");

  // ---------------- LINE GRAPH STATE ----------------
  const [lineLabels, setLineLabels] = useState<string[]>([]);
  const [registeredData, setRegisteredData] = useState<number[]>([]);
  const [activeData, setActiveData] = useState<number[]>([]);
  const [mauData, setMauData] = useState<number[]>([]);
  const [lineLoading, setLineLoading] = useState(true);

  // ---------------- BAR GRAPH STATE ----------------
  const [barLabels, setBarLabels] = useState<string[]>([]);
  const [barA, setBarA] = useState<number[]>([]);
  const [barB, setBarB] = useState<number[]>([]);
  const [barLoading, setBarLoading] = useState(true);

  // ----------------------------------------------------
  // Range Mapping for both graphs (same structure)
  // ----------------------------------------------------
  const buildRequestParams = (rangeValue: string) => {
    if (rangeValue === "7") return { range: "last7" };
    if (rangeValue === "30") return { range: "last30" };
    if (rangeValue === "90") return { range: "3months" };

    if (rangeValue.startsWith("FY_")) {
      const fy = rangeValue.replace("FY_", "").replace("_", "-");
      return {
        range: "fy",
        financialYear: fy
      };
    }

    return { range: "last7" };
  };

  // ----------------------------------------------------
  // Fetch LINE graph data
  // ----------------------------------------------------
  const fetchLineGraphData = async () => {
    try {
      setLineLoading(true);

      const params = buildRequestParams(lineRange);
      const response = await getUserRegistrations(params);

      const rawData = response?.data?.data || response?.data || {};

      setLineLabels(rawData.labels || []);
      setRegisteredData(rawData.registered || rawData.values || []);
      setActiveData(rawData.active || []);
      setMauData(rawData.mau || []);

    } catch (error) {
      console.error("Line Graph API Error:", error);
      setLineLabels([]);
      setRegisteredData([]);
      setActiveData([]);
      setMauData([]);
    } finally {
      setLineLoading(false);
    }
  };

  // ----------------------------------------------------
  // Fetch BAR graph data
  // ----------------------------------------------------
  const fetchBarGraphData = async () => {
    try {
      setBarLoading(true);

      const params = buildRequestParams(barRange);
      const response = await getPointsGraph(params);

      setBarLabels(response?.data?.data?.labels || []);
      setBarA(response?.data?.data?.scannedPoints || []);
      setBarB(response?.data?.data?.redeemedPoints || []);

    } catch (error) {
      console.error("Bar Graph API Error:", error);
      setBarLabels([]);
      setBarA([]);
      setBarB([]);
    } finally {
      setBarLoading(false);
    }
  };

  // Trigger load for Line graph
  useEffect(() => {
    fetchLineGraphData();
  }, [lineRange]);

  // Trigger load for Bar graph
  useEffect(() => {
    fetchBarGraphData();
  }, [barRange]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* LEFT — Line Chart */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Member Growth &amp; Engagement
          </h2>

          <select
            value={lineRange}
            onChange={(e) => setLineRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="FY_2025_2026">2025-2026</option>
          </select>
        </div>

        {lineLoading ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : (
          <LineGraph
            labels={lineLabels}
            registered={registeredData}
            active={activeData}
            mau={mauData}
          />
        )}
      </div>

      {/* RIGHT — Bar Chart */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Points Issued vs Redeemed
          </h2>

          <select
            value={barRange}
            onChange={(e) => setBarRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="FY_2025_2026">2025-2026</option>
          </select>
        </div>

        {barLoading ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : (
          <BarGraph labels={barLabels} datasetA={barA} datasetB={barB} />
        )}
      </div>

    </div>
  );
};

export default StatsRowThree;
