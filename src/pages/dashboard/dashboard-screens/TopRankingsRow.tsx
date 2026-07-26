import React, { useEffect, useState } from "react";
import { getTopMechanics, getTopDealers, getTopProducts } from "../../../services/ApiService";

interface MechanicItem {
    rank: number;
    name: string;
    city: string;
    points: number;
    formattedPoints: string;
}

interface DealerItem {
    rank: number;
    name: string;
    shopName: string;
    city: string;
    subtitle?: string;
    points: number;
    formattedPoints: string;
}

interface ProductItem {
    rank: number;
    productName: string;
    skuCode?: string;
    successCount: number;
    salesAmount: number;
    percentage: number;
    formattedPercentage: string;
}

const TopRankingsRow: React.FC = () => {
    const [mechanics, setMechanics] = useState<MechanicItem[]>([]);
    const [dealers, setDealers] = useState<DealerItem[]>([]);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllRankings();
    }, []);

    const fetchAllRankings = async () => {
        try {
            setLoading(true);
            const [mechRes, dealerRes, prodRes] = await Promise.all([
                getTopMechanics(5),
                getTopDealers(5),
                getTopProducts(5),
            ]);

            setMechanics(mechRes?.data?.data || []);
            setDealers(dealerRes?.data?.data || []);
            setProducts(prodRes?.data?.data || []);
        } catch (error) {
            console.error("Error fetching top rankings:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* ── CARD 1: TOP MECHANICS ── */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-5">Top Mechanics</h3>
                    {loading ? (
                        <div className="space-y-4 py-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <div key={n} className="h-9 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : mechanics.length === 0 ? (
                        <p className="text-xs text-gray-400">No data available</p>
                    ) : (
                        <div className="space-y-4">
                            {mechanics.map((m, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <span className="text-xs font-semibold text-gray-400 w-3 text-center flex-shrink-0">
                                            {m.rank || i + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{m.city}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex-shrink-0">
                                        {m.formattedPoints || `${m.points?.toLocaleString()} pts`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── CARD 2: TOP DEALERS ── */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-5">Top Dealers</h3>
                    {loading ? (
                        <div className="space-y-4 py-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <div key={n} className="h-9 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : dealers.length === 0 ? (
                        <p className="text-xs text-gray-400">No data available</p>
                    ) : (
                        <div className="space-y-4">
                            {dealers.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <span className="text-xs font-semibold text-gray-400 w-3 text-center flex-shrink-0">
                                            {d.rank || i + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{d.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{d.subtitle || d.city}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 flex-shrink-0 ml-2">
                                        {d.formattedPoints}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── CARD 3: TOP PRODUCTS ── */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-5">Top Products</h3>
                    {loading ? (
                        <div className="space-y-4 py-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <div key={n} className="h-9 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <p className="text-xs text-gray-400">No data available</p>
                    ) : (
                        <div className="space-y-4">
                            {products.map((p, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-gray-900 truncate pr-2">{p.productName}</span>
                                        <span className="font-medium text-gray-400 flex-shrink-0">{p.formattedPercentage || `${p.percentage}%`}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, Math.max(2, p.percentage))}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopRankingsRow;
