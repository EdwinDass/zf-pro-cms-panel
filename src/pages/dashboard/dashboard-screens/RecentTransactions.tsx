// src/components/RecentTransactions/RecentTransactions.tsx

import React from "react";

const RecentTransactions: React.FC = () => {
  const transactions = [
    {
      id: "#TXN-2847",
      member: "John Doe",
      type: "Earned",
      points: "+250",
      time: "2 mins ago",
    },
    {
      id: "#TXN-2846",
      member: "Alice Smith",
      type: "Redeemed",
      points: "-500",
      time: "5 mins ago",
    },
    {
      id: "#TXN-2845",
      member: "Robert Johnson",
      type: "Earned",
      points: "+180",
      time: "12 mins ago",
    },
    {
      id: "#TXN-2844",
      member: "Emma Wilson",
      type: "Earned",
      points: "+320",
      time: "18 mins ago",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-5 text-sm font-semibold text-gray-600 border-b pb-2">
        <div>Transaction ID</div>
        <div>Member</div>
        <div>Type</div>
        <div>Points</div>
        <div>Time</div>
      </div>

      {/* Table Rows */}
      {transactions.map((txn, index) => (
        <div
          key={index}
          className="grid grid-cols-5 py-3 text-sm items-center border-b last:border-none"
        >
          <div className="text-gray-800">{txn.id}</div>
          <div className="text-gray-800">{txn.member}</div>

          {/* Type Badge */}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                txn.type === "Earned"
                  ? "bg-green-50 text-green-600"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              {txn.type}
            </span>
          </div>

          {/* Points */}
          <div
            className={`font-medium ${
              txn.points.startsWith("+") ? "text-green-600" : "text-red-500"
            }`}
          >
            {txn.points}
          </div>

          <div className="text-gray-600">{txn.time}</div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;
