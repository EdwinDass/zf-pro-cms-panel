import React from "react";
import { UserPlus, QrCode, Megaphone, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add New Member",
      icon: <UserPlus className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      path: "/members-management",
    },
    {
      label: "Generate QR Code",
      icon: <QrCode className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
      path: "/qr",
    },
    {
      label: "Process Redemption",
      icon: <Megaphone className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
      path: "/process-management",
    },
    {
      label: "View Reports",
      icon: <LineChart className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50",
      path: "/mis-analytics",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            type="button"
            key={index}
            className={`w-full flex items-center gap-3 p-4 rounded-lg ${action.bg} transition hover:scale-[1.01]`}
            onClick={() => navigate(action.path)}
          >
            {action.icon}
            <span className="text-gray-800 font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;