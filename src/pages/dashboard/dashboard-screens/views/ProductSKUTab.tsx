import React from "react";
import ScansByProductChart from "./ScansByProductChart";
import CategorySharePieChart from "./CategorySharePieChart";
import ProductScanHeatmap from "./ProductScanHeatmap";

const ProductSKUTabContent: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Top row: Scans by product & Category share side-by-side */}
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
