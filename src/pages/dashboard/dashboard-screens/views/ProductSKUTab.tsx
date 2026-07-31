import React, { useEffect, useState } from "react";
import ScansByProductChart from "./ScansByProductChart";
import CategorySharePieChart from "./CategorySharePieChart";
import ProductScanHeatmap from "./ProductScanHeatmap";
import Card from "../Card";
import { FaBoxes, FaQrcode, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { getProductSkuStats } from "../../../../services/ApiService";

const ProductSKUTabContent: React.FC = () => {
    const [stats, setStats] = useState({
        activeSkus: 0,
        totalScans: 0,
        fastMovers: { skuName: "Loading...", skuCode: "", scanCount: 0 },
        slowMovers: { skuName: "Loading...", skuCode: "", scanCount: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductSkuStats()
            .then(res => {
                const d = res?.data?.data || {};
                setStats({
                    activeSkus: d.activeSkus ?? 0,
                    totalScans: d.totalScans ?? 0,
                    fastMovers: d.fastMovers || { skuName: "None", skuCode: "", scanCount: 0 },
                    slowMovers: d.slowMovers || { skuName: "None", skuCode: "", scanCount: 0 }
                });
            })
            .catch(err => console.error("Product SKU stats error:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            {/* Top row: 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Active SKUs"
                    value={loading ? "..." : stats.activeSkus.toLocaleString()}
                    percentage="Catalog Active"
                    percentageColor="text-blue-600"
                    icon={<FaBoxes />}
                    iconColor="text-blue-500"
                />
                <Card
                    title="Total Scans"
                    value={loading ? "..." : stats.totalScans.toLocaleString()}
                    percentage="Successful Scans"
                    percentageColor="text-teal-600"
                    icon={<FaQrcode />}
                    iconColor="text-teal-500"
                />
                <Card
                    title="Fast Movers"
                    value={loading ? "..." : stats.fastMovers.skuName}
                    percentage={`${stats.fastMovers.scanCount.toLocaleString()} Scans`}
                    percentageColor="text-green-600"
                    icon={<FaArrowUp />}
                    iconColor="text-green-500"
                />
                <Card
                    title="Slow Movers"
                    value={loading ? "..." : stats.slowMovers.skuName}
                    percentage={`${stats.slowMovers.scanCount.toLocaleString()} Scans`}
                    percentageColor="text-amber-600"
                    icon={<FaArrowDown />}
                    iconColor="text-amber-500"
                />
            </div>

            {/* Middle row: Scans by product & Category share side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScansByProductChart />
                <CategorySharePieChart />
            </div>

            {/* Bottom row: Product heat map — scan intensity by zone */}
            <ProductScanHeatmap />
        </div>
    );
};

export default ProductSKUTabContent;
