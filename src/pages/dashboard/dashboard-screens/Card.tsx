// src/components/Card/Card.tsx
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

interface CardProps {
  title: string;
  value: string | number;
  percentage: string;
  percentageColor?: string; 
  icon: React.ReactNode;
  iconColor?: string; // ⭐ NEW — dynamic icon color
  onClick?: () => void;
  extra?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  percentage,
  percentageColor = "text-green-600",
  icon,
  iconColor = "text-blue-600", // ⭐ default icon color
  onClick,
  extra,
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col gap-3 group ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
    >

      {/* Top row: title + icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h2 className="text-gray-600 font-medium text-sm">{title}</h2>
          {onClick && (
            <FiArrowUpRight className="text-gray-400 group-hover:text-blue-500 transition-all text-sm opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>
        
        {/* ⭐ Apply dynamic icon color */}
        <span className={`${iconColor} text-xl`}>
          {icon}
        </span>
      </div>

      {/* Big value */}
      <p className="text-3xl font-bold text-gray-900">{value}</p>

      {/* Extra details */}
      {extra}

      {/* Percentage text
      <p className="text-sm text-gray-500">
        <span className={`${percentageColor} font-semibold`}>{percentage}</span>{" "}
        from last month
      </p> */}
    </div>
  );
};

export default Card;
