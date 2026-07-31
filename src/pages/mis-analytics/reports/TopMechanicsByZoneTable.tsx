import React, { useEffect, useState } from "react";
import { getTopMechanicsByZone } from "../../../services/ApiService";

export interface ZoneMechanicItem {
    mechanic: string;
    city: string;
    zone: string;
    points: number;
    formattedPoints: string;
}

const TopMechanicsByZoneTable: React.FC = () => {
    const [mechanics, setMechanics] = useState<ZoneMechanicItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getTopMechanicsByZone();
                const apiData = res?.data?.data;
                if (Array.isArray(apiData)) {
                    setMechanics(apiData);
                }
            } catch (error) {
                console.error("Error fetching top mechanics by zone:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 w-full">
            <h2 className="text-lg font-semibold text-gray mb-6">Top Mechanics By Zone</h2>

            {loading ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    Loading top mechanics by zone...
                </div>
            ) : mechanics.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    No mechanics data available
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                                <th className="pb-3 pl-2">Mechanic</th>
                                <th className="pb-3">City</th>
                                <th className="pb-3">Zone</th>
                                <th className="pb-3 pr-2 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mechanics.map((m, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="py-3.5 pl-2 font-semibold text-gray-900 text-sm">
                                        {m.mechanic}
                                    </td>
                                    <td className="py-3.5 text-gray-600 text-xs">{m.city}</td>
                                    <td className="py-3.5 text-gray-600 text-xs">{m.zone}</td>
                                    <td className="py-3.5 pr-2 text-right font-bold text-gray-800 text-sm">
                                        {m.formattedPoints || m.points.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TopMechanicsByZoneTable;
