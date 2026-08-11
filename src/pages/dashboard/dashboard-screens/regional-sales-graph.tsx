// src/pages/dashboard/dashboard-screens/regional-sales-graph.tsx

import React, { useEffect, useState } from "react";
import { getRegionalSalesPerformance } from "../../../services/ApiService";

export interface RegionData {
  zone: string;
  amount: number;
  formattedAmount?: string;
}

interface RegionalSalesGraphProps {
  title?: string;
  data?: RegionData[];
}

const RegionalSalesGraph: React.FC<RegionalSalesGraphProps> = ({
  title = "Regional Sales Performance",
  data: propsData,
}) => {
  const [regions, setRegions] = useState<RegionData[]>(propsData || []);
  const [loading, setLoading] = useState<boolean>(!propsData);

  useEffect(() => {
    if (propsData) {
      setRegions(propsData);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getRegionalSalesPerformance();
        const apiData = res?.data?.data?.regions;
        if (Array.isArray(apiData)) {
          setRegions(apiData);
        }
      } catch (error) {
        console.error("Failed to fetch regional sales performance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propsData]);

  // Find max value to compute percentage widths
  const maxAmount = Math.max(...regions.map((r) => r.amount || 0), 1);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 w-full h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading regional sales...
        </div>
      ) : (
        <div className="space-y-4 my-auto">
          {regions.map((item, idx) => {
            // Proportional width relative to maximum region amount; 0 stays 0 (no bar)
            const pct = item.amount > 0 ? Math.min((item.amount / maxAmount) * 100, 100) : 0;

            // Color rule: Last zone (East) gets coral, others blue
            const isCoralRed = idx >= 3 || item.zone === "East";
            const barBgColor = isCoralRed ? "bg-[#F04438]" : "bg-[#1E64E2]";

            return (
              <div key={item.zone || idx} className="flex items-center text-sm">
                {/* Zone Label */}
                <span className="w-16 text-right font-medium text-gray-500 pr-4 shrink-0">
                  {item.zone}
                </span>

                {/* Track and Fill Bar */}
                <div className="flex-1 bg-[#F1F5F9] h-10 rounded-xl overflow-hidden relative flex items-center">
                  <div
                    className={`${barBgColor} h-full rounded-xl transition-all duration-500 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Right Value Label */}
                <span className="w-16 pl-3 font-medium text-[#94A3B8] shrink-0">
                  {item.formattedAmount || `₹${item.amount}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RegionalSalesGraph;
