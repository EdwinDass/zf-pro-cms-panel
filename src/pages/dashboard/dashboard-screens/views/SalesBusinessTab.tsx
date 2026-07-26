import React from "react";
import { GlobalFilterValues } from "../../dashboard-screens/GlobalFilters";
import CategorySalesChart from "./CategorySalesChart";
import ZoneSalesChart from "./ZoneSalesChart";

interface Props {
    filters: GlobalFilterValues;
}

const SalesBusinessTab: React.FC<Props> = ({ filters }) => {
    return (
        <div className="space-y-6">
            {/* Top row: Sales by Category & Zone Sales side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategorySalesChart filters={filters} />
                <ZoneSalesChart filters={filters} />
            </div>
        </div>
    );
};

export default SalesBusinessTab;
