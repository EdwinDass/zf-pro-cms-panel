import React, { useEffect, useState } from "react";
import { getProductHeatmapByZone } from "../../../../services/ApiService";

interface ProductHeatmapItem {
    productName: string;
    skuCode: string;
    totalScans: number;
    zones: Record<string, number>;
}

interface HeatmapData {
    zones: string[];
    products: ProductHeatmapItem[];
}

const ProductScanHeatmap: React.FC = () => {
    const [heatmapData, setHeatmapData] = useState<HeatmapData>({
        zones: ["West", "South", "North", "East", "Central"],
        products: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getProductHeatmapByZone(5);
                const apiData = res?.data?.data;
                if (apiData && Array.isArray(apiData.products)) {
                    setHeatmapData(apiData);
                }
            } catch (error) {
                console.error("Error fetching product heatmap:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate overall max value for color intensity
    const allValues = heatmapData.products.flatMap((p) =>
        Object.values(p.zones || {})
    );
    const maxVal = Math.max(...allValues, 1);

    const getCellBg = (value: number) => {
        if (value === 0) return "bg-blue-50 text-gray-400";
        const ratio = value / maxVal;
        if (ratio >= 0.85) return "bg-[#1E64E2] text-white font-semibold";
        if (ratio >= 0.70) return "bg-[#2563EB] text-white font-semibold";
        if (ratio >= 0.55) return "bg-[#3B82F6] text-white font-medium";
        if (ratio >= 0.40) return "bg-[#60A5FA] text-white font-medium";
        if (ratio >= 0.25) return "bg-[#93C5FD] text-blue-950 font-medium";
        return "bg-[#BFDBFE] text-blue-950 font-normal";
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Product heat map — scan intensity by zone
            </h2>

            {loading ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    Loading product heatmap...
                </div>
            ) : heatmapData.products.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    No product heatmap data available
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="min-w-[650px]">
                        {/* ── Table Header ── */}
                        <div className="grid grid-cols-6 gap-2 mb-3 text-xs font-semibold text-gray-500">
                            <div className="col-span-1 pl-2">Product</div>
                            {heatmapData.zones.map((zone) => (
                                <div key={zone} className="text-center">
                                    {zone}
                                </div>
                            ))}
                        </div>

                        {/* ── Rows ── */}
                        <div className="space-y-2">
                            {heatmapData.products.map((item, idx) => (
                                <div key={item.skuCode || idx} className="grid grid-cols-6 gap-2 items-center">
                                    {/* Product Name */}
                                    <div className="col-span-1 text-xs font-semibold text-gray-800 truncate pl-2" title={item.productName}>
                                        {item.productName}
                                    </div>

                                    {/* Heatmap cells for each zone */}
                                    {heatmapData.zones.map((zone) => {
                                        const countVal = item.zones[zone] || 0;
                                        return (
                                            <div
                                                key={zone}
                                                className={`h-11 rounded-lg flex items-center justify-center text-xs transition-colors duration-200 ${getCellBg(
                                                    countVal
                                                )}`}
                                            >
                                                {countVal}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductScanHeatmap;
