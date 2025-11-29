import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  percentage: string;
  percentageColor?: string; 
  icon: React.ReactNode;
  iconColor?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  percentage,
  percentageColor = "text-green-600",
  icon,
  iconColor = "text-blue-600",
}) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col gap-3">

      {/* Top row: title + icon */}
      <div className="flex justify-between items-center">
        <h2 className="text-gray-600 font-medium text-sm">{title}</h2>
        
        {/* ⭐ Apply dynamic icon color */}
        <span className={`${iconColor} text-xl`}>
          {icon}
        </span>
      </div>

      {/* Big value */}
      <p className="text-3xl font-bold text-gray-900">{value}</p>

      {/* Percentage text
      <p className="text-sm text-gray-500">
        <span className={`${percentageColor} font-semibold`}>{percentage}</span>{" "}
        from last month
      </p> */}
    </div>
  );
};

export default Card;
