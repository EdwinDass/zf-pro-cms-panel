import React, { useEffect, useState } from "react";
import { getDensityByState } from "../../../../services/ApiService";

interface StateDensityScore {
    state: string;
    densityScore: number;
    memberCount?: number;
    scanCount?: number;
}

const DensityByStateChart: React.FC = () => {
    const [densityList, setDensityList] = useState<StateDensityScore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getDensityByState();
                const apiData = res?.data?.data;
                if (Array.isArray(apiData)) {
                    setDensityList(apiData);
                }
            } catch (error) {
                console.error("Error fetching density by state:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getBarColor = (score: number) => {
        if (score >= 70) return "#10B981"; // Green
        if (score >= 40) return "#F59E0B"; // Amber / Orange
        return "#F04438"; // Red
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 w-full flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Density by state</h2>

            {loading ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    Loading density by state...
                </div>
            ) : densityList.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    No state density data available
                </div>
            ) : (
                <div className="space-y-3.5 my-auto">
                    {densityList.map((item, idx) => {
                        const score = item.densityScore || 0;
                        const pct = Math.min(Math.max(score, 5), 100);
                        const barColor = getBarColor(score);

                        return (
                            <div key={item.state || idx} className="flex items-center text-sm">
                                {/* State Name Label */}
                                <span className="w-36 text-right font-medium text-gray-600 pr-4 shrink-0 truncate text-xs">
                                    {item.state}
                                </span>

                                {/* Bar Track and Colored Fill Bar */}
                                <div className="flex-1 bg-[#F1F5F9] h-9 rounded-xl overflow-hidden relative flex items-center mr-3">
                                    <div
                                        className="h-full rounded-xl transition-all duration-500 ease-out"
                                        style={{ width: `${pct}%`, backgroundColor: barColor }}
                                    />
                                </div>

                                {/* Score label on the right */}
                                <span className="w-8 font-semibold text-xs text-gray-500 shrink-0">
                                    {score}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DensityByStateChart;
