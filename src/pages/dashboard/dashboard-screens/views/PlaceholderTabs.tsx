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


import SalesBusinessTabContent from "./SalesBusinessTab";

export const SalesBusinessTab: React.FC<Props> = ({ filters }) => (
    <SalesBusinessTabContent filters={filters} />
);

import Member360TabContent from "./Member360Tab";

export const Member360Tab: React.FC<Props> = () => (
    <Member360TabContent />
);

import ProductSKUTabContent from "./ProductSKUTab";

export const ProductSKUTab: React.FC<Props> = () => (
    <ProductSKUTabContent />
);

import RewardsTabContent from "./RewardsTab";

export const RewardsTab: React.FC<Props> = () => (
    <RewardsTabContent />
);

import GeographyTabContent from "./GeographyTab";

export const GeographyTab: React.FC<Props> = () => (
    <GeographyTabContent />
);
