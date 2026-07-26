import React, { useEffect, useState } from "react";
import { getScansByProduct } from "../../../../services/ApiService";

interface ProductScanItem {
    rank: number;
    productName: string;
    skuCode: string;
    scanCount: number;
    formattedScanCount: string;
}

const ScansByProductChart: React.FC = () => {
    const [products, setProducts] = useState<ProductScanItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getScansByProduct(5);
                const apiData = res?.data?.data;
                if (Array.isArray(apiData)) {
                    setProducts(apiData);
                }
            } catch (error) {
                console.error("Error fetching scans by product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const maxCount = Math.max(...products.map((p) => p.scanCount || 0), 1);

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 w-full flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Scans by product</h2>

            {loading ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    Loading scans by product...
                </div>
            ) : products.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    No scan data available by product
                </div>
            ) : (
                <div className="space-y-4 my-auto">
                    {products.map((item, idx) => {
                        const pct = Math.min(Math.max((item.scanCount / maxAmount(maxCount, item.scanCount)) * 100, 4), 100);

                        return (
                            <div key={item.skuCode || idx} className="flex items-center text-sm">
                                {/* Product Name Label */}
                                <span className="w-44 text-right font-medium text-gray-700 pr-4 shrink-0 truncate">
                                    {item.productName}
                                </span>

                                {/* Bar Track and Filled Blue Bar */}
                                <div className="flex-1 bg-[#F1F5F9] h-10 rounded-xl overflow-hidden relative flex items-center">
                                    <div
                                        className="bg-[#1E64E2] h-full rounded-xl transition-all duration-500 ease-out flex items-center justify-end pr-3"
                                        style={{ width: `${pct}%` }}
                                    >
                                        <span className="text-xs font-semibold text-white">
                                            {item.formattedScanCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const maxAmount = (max: number, val: number) => {
    return max > 0 ? max : 1;
};

export default ScansByProductChart;
