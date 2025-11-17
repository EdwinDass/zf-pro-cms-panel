// src/components/Card/CardVariantTwo.tsx
import React from "react";

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
}) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col gap-4">

      {/* Top: Title + Icon */}
      <div className="flex justify-between items-center">
        <h2 className="text-gray-600 font-medium text-sm">{title}</h2>
        <span className={`${iconColor} text-xl`}>{icon}</span>
      </div>

      {/* Value Section */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">{leftValue}</p>
          <p className="text-sm text-gray-500">{leftLabel}</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900">{rightValue}</p>
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
