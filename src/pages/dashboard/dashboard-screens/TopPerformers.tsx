// src/components/TopPerformers/TopPerformers.tsx

import React, { useEffect, useState } from "react";
import { getTopPerformers } from "../../../services/ApiService";

const TopPerformers: React.FC = () => {
  const [performers, setPerformers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformers();
  }, []);

  const fetchPerformers = async () => {
    try {
      setLoading(true);

      const response = await getTopPerformers(5);
      setPerformers(response?.data?.data || []);

    } catch (error) {
      console.error("Error loading top performers:", error);
      setPerformers([]);
    } finally {
      setLoading(false);
    }
  };

  // Colors for top ranks
  const rankColors = [
    "bg-yellow-100 text-yellow-700",
    "bg-gray-200 text-gray-700",
    "bg-orange-100 text-orange-700",
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Top Performers This Month
      </h2>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : performers.length === 0 ? (
        <p className="text-gray-500">No performers found</p>
      ) : (
        <div className="space-y-6">
          {performers.map((p, index) => (
            <div
              key={index}
              className="flex justify-between items-center"
            >
              {/* Left side - Rank + Details */}
              <div className="flex items-center gap-4">

                {/* Rank Badge */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full font-bold ${
                    rankColors[index] || "bg-blue-100 text-blue-700"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Name + Workshop + Points */}
                <div>
                  <p className="text-gray-900 font-medium">
                    {p.displayName || p.userName || "Unknown User"}
                  </p>
                  <p className="text-gray-500 text-xs font-medium">
                    {p.workshopName || p.storeName || "-"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {p.totalPoints} points
                  </p>
                </div>
              </div>

              {/* Right side - Placeholder vs last month */}
              <div className="text-right">
                <p className="text-green-600 font-semibold">
                  +0%
                </p>
                <p className="text-gray-500 text-xs">vs last month</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
