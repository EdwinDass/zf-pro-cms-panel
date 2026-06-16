// src/components/Card/CardVariantTwo.tsx
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

interface CardVariantTwoProps {
  title: string;
  icon: React.ReactNode;
  iconColor?: string;

  leftValue: string | number;   // Approved
  leftLabel: string;            // "Approved"

  rightValue: string | number;  // Pending
  rightLabel: string;           // "Pending"

  progress: number;             // 0 to 100
  footerText: string;           // "75% of members have completed KYC"
  onClick?: () => void;
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

const CardVariantTwo: React.FC<CardVariantTwoProps> = ({
  title,
  icon,
  iconColor = "text-blue-600",

  leftValue,
  leftLabel,

  rightValue,
  rightLabel,

  progress,
  footerText,
  onClick,
  onLeftClick,
  onRightClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col gap-4 group ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
    >

      {/* Top: Title + Icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h2 className="text-gray-600 font-medium text-sm">{title}</h2>
          {onClick && (
            <FiArrowUpRight className="text-gray-400 group-hover:text-blue-500 transition-all text-sm opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>
        <span className={`${iconColor} text-xl`}>{icon}</span>
      </div>

      {/* Value Section */}
      <div className="flex justify-between items-center">
        <div
          onClick={(e) => {
            if (onLeftClick) {
              e.stopPropagation();
              onLeftClick();
            }
          }}
          className={onLeftClick ? "group/left cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors" : ""}
        >
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold text-gray-900">{leftValue}</p>
            {onLeftClick && (
              <FiArrowUpRight className="text-gray-400 group-hover/left:text-blue-500 transition-all text-sm opacity-50 group-hover/left:opacity-100 group-hover/left:translate-x-0.5 group-hover/left:-translate-y-0.5" />
            )}
          </div>
          <p className="text-sm text-gray-500">{leftLabel}</p>
        </div>

        <div
          onClick={(e) => {
            if (onRightClick) {
              e.stopPropagation();
              onRightClick();
            }
          }}
          className={onRightClick ? "group/right cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors" : ""}
        >
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold text-gray-900">{rightValue}</p>
            {onRightClick && (
              <FiArrowUpRight className="text-gray-400 group-hover/right:text-blue-500 transition-all text-sm opacity-50 group-hover/right:opacity-100 group-hover/right:translate-x-0.5 group-hover/right:-translate-y-0.5" />
            )}
          </div>
          <p className="text-sm text-gray-500">{rightLabel}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-500">{footerText}</p>
    </div>
  );
};

export default CardVariantTwo;
