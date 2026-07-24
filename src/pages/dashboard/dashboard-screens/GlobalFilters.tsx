import React, { useState } from "react";

export interface GlobalFilterValues {
    region: string;
    product: string;
    category: string;
    date: string;
}

interface GlobalFiltersProps {
    filters: GlobalFilterValues;
    onChange: (filters: GlobalFilterValues) => void;
}

const FilterSelect: React.FC<{
    label: string;
    id: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
}> = ({ label, id, value, options, onChange }) => (
    <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{label}:</span>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-gray-200 bg-white rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       hover:border-gray-300 transition-colors cursor-pointer min-w-[90px]"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ filters, onChange }) => {
    const set = (key: keyof GlobalFilterValues) => (val: string) =>
        onChange({ ...filters, [key]: val });

    return (
        <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm mb-4">
            {/* Filter icon */}
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold pr-2 border-r border-gray-200">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
            </div>

            <FilterSelect
                label="Region"
                id="filter-region"
                value={filters.region}
                onChange={set("region")}
                options={[
                    { value: "all", label: "All" },
                    { value: "west", label: "West" },
                    { value: "south", label: "South" },
                    { value: "north", label: "North" },
                    { value: "east", label: "East" },
                    { value: "central", label: "Central" },
                ]}
            />

            <FilterSelect
                label="Product"
                id="filter-product"
                value={filters.product}
                onChange={set("product")}
                options={[
                    { value: "all", label: "All" },
                    { value: "braking", label: "Braking" },
                    { value: "clutch", label: "Clutch" },
                    { value: "filters", label: "Filters" },
                    { value: "belts", label: "Belts" },
                ]}
            />

            <FilterSelect
                label="Category"
                id="filter-category"
                value={filters.category}
                onChange={set("category")}
                options={[
                    { value: "all", label: "All" },
                    { value: "two-wheeler", label: "2-Wheeler" },
                    { value: "four-wheeler", label: "4-Wheeler" },
                    { value: "commercial", label: "Commercial" },
                ]}
            />

            <FilterSelect
                label="Date"
                id="filter-date"
                value={filters.date}
                onChange={set("date")}
                options={[
                    { value: "all", label: "All Time" },
                    { value: "7", label: "Last 7 Days" },
                    { value: "30", label: "Last 30 Days" },
                    { value: "90", label: "Last 3 Months" },
                    { value: "FY_2025_2026", label: "FY 2025-26" },
                    { value: "FY_2024_2025", label: "FY 2024-25" },
                ]}
            />

            {/* Clear filters */}
            {(filters.region !== "all" || filters.product !== "all" || filters.category !== "all" || filters.date !== "all") && (
                <button
                    onClick={() => onChange({ region: "all", product: "all", category: "all", date: "all" })}
                    className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                    id="clear-filters-btn"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
};

export default GlobalFilters;
