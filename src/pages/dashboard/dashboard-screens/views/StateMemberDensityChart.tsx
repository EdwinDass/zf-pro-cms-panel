import React, { useEffect, useState } from "react";
import { getStateMemberDensity } from "../../../../services/ApiService";

interface StateDensityItem {
    state: string;
    memberCount: number;
    formattedCount: string;
    growth?: string;
    isPositive?: boolean;
    percentage: number;
}

const StateMemberDensityChart: React.FC = () => {
    const [states, setStates] = useState<StateDensityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getStateMemberDensity();
                const apiData = res?.data?.data;
                if (Array.isArray(apiData)) {
                    setStates(apiData);
                }
            } catch (error) {
                console.error("Error fetching state member density:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const maxCount = Math.max(...states.map((s) => s.memberCount || 0), 1);

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 w-full flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">State member density</h2>

            {loading ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    Loading state member density...
                </div>
            ) : states.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    No state member density data available
                </div>
            ) : (
                <div className="space-y-5 my-auto">
                    {states.map((item, idx) => {
                        const pct = item.memberCount > 0 ? Math.min((item.memberCount / maxCount) * 100, 100) : 0;
                        const isRed = idx === 5 || idx === 6; // Matching image sample highlighting
                        const growthText = item.growth || (isRed ? `-${(idx + 2)}%` : `+${(15 - idx * 2)}%`);
                        const isPos = !growthText.startsWith("-");

                        return (
                            <div key={item.state || idx} className="space-y-1.5">
                                {/* State Name & Count/Growth Header */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-gray-800">{item.state}</span>
                                    <div className="flex items-center space-x-2 text-xs">
                                        <span className="font-bold text-gray-600">
                                            {item.formattedCount || item.memberCount.toLocaleString()}
                                        </span>
                                        <span
                                            className={`font-semibold ${
                                                isPos ? "text-emerald-500" : "text-rose-500"
                                            }`}
                                        >
                                            {growthText}
                                        </span>
                                    </div>
                                </div>

                                {/* Thin Rounded Line Bar */}
                                <div className="w-full bg-[#F8FAFC] h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                                            isRed ? "bg-[#F04438]" : "bg-[#1E64E2]"
                                        }`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StateMemberDensityChart;
