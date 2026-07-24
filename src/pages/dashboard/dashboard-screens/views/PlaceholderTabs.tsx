import React from "react";
import { GlobalFilterValues } from "../../dashboard-screens/GlobalFilters";
import ProgramPerformanceTabContent from "./ProgramPerformanceTab";

interface Props {
    filters: GlobalFilterValues;
}

const EmptyTabPlaceholder: React.FC<{ title: string; description: string; icon: string }> = ({
    title,
    description,
    icon,
}) => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-3xl">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-400 max-w-xs">{description}</p>
    </div>
);

export const ProgramPerformanceTab: React.FC<Props> = () => (
    <ProgramPerformanceTabContent />
);


export const SalesBusinessTab: React.FC<Props> = () => (
    <EmptyTabPlaceholder
        icon="💰"
        title="Sales & Business"
        description="Revenue breakdown, sales trends and business analytics will be shown here."
    />
);

export const Member360Tab: React.FC<Props> = () => (
    <EmptyTabPlaceholder
        icon="👤"
        title="Member 360"
        description="Detailed member insights, segmentation and lifetime value analysis will be shown here."
    />
);

export const ProductSKUTab: React.FC<Props> = () => (
    <EmptyTabPlaceholder
        icon="📦"
        title="Product & SKU"
        description="Product-wise performance, SKU analytics and category breakdown will be shown here."
    />
);

export const RewardsTab: React.FC<Props> = () => (
    <EmptyTabPlaceholder
        icon="🎁"
        title="Rewards"
        description="Points economy, redemption trends and reward catalog performance will be shown here."
    />
);

export const GeographyTab: React.FC<Props> = () => (
    <EmptyTabPlaceholder
        icon="🗺️"
        title="Geography"
        description="Zone-wise, state-wise and city-level sales and member distribution will be shown here."
    />
);
