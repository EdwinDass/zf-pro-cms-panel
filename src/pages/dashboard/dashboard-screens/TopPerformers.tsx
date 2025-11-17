// src/components/TopPerformers/TopPerformers.tsx

import React from "react";

const TopPerformers: React.FC = () => {
  const performers = [
    {
      rank: 1,
      name: "Michael Chen",
      points: "2,450 points",
      change: "+28%",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      rank: 2,
      name: "Sarah Williams",
      points: "2,180 points",
      change: "+15%",
      color: "bg-gray-100 text-gray-700",
    },
    {
      rank: 3,
      name: "David Martinez",
      points: "1,920 points",
      change: "+32%",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Top Performers This Month
      </h2>

      <div className="space-y-6">
        {performers.map((p, index) => (
          <div
            key={index}
            className="flex justify-between items-center"
          >
            {/* Left side - Rank + Details */}
            <div className="flex items-center gap-4">

              {/* Rank badge */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full font-bold ${p.color}`}
              >
                {p.rank}
              </div>

              {/* Name + Points */}
              <div>
                <p className="text-gray-900 font-medium">{p.name}</p>
                <p className="text-gray-600 text-sm">{p.points}</p>
              </div>
            </div>

            {/* Right side - Percentage */}
            <div className="text-right">
              <p className="text-green-600 font-semibold">{p.change}</p>
              <p className="text-gray-500 text-xs">vs last month</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;
