import React, { useState } from "react";

export interface Column {
    key: string;
    label: string;
    className?: string;
    render?: (item: any) => React.ReactNode;
}

interface TableComponentProps {
    columns: Column[];
    data: any[];
    pageSize?: number;
    selectable?: boolean;
    selectedRows?: any[];
    onSelectionChange?: (selected: any[]) => void;
}

const CustomTable: React.FC<TableComponentProps> = ({
    columns,
    data,
    pageSize = 5,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
}) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
    };

    const isAllSelected =
        paginatedData.length > 0 &&
        paginatedData.every(item =>
            selectedRows.some(selected => selected.id === item.id)
        );

    const handleSelectAll = () => {
        if (!onSelectionChange) return;

        if (isAllSelected) {
            const newSelection = selectedRows.filter(
                selected => !paginatedData.some(item => item.id === selected.id)
            );
            onSelectionChange(newSelection);
        } else {
            const newItems = paginatedData.filter(
                item => !selectedRows.some(selected => selected.id === item.id)
            );
            onSelectionChange([...selectedRows, ...newItems]);
        }
    };

    const handleRowSelect = (item: any) => {
        if (!onSelectionChange) return;

        const isSelected = selectedRows.some(
            selected => selected.id === item.id
        );

        if (isSelected) {
            onSelectionChange(
                selectedRows.filter(selected => selected.id !== item.id)
            );
        } else {
            onSelectionChange([...selectedRows, item]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg">

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {selectable && (
                                <th className="px-6 py-3 text-left w-12">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        aria-label="Select all rows"
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </th>
                            )}

                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap ${col.className}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((item, index) => {
                            const isSelected = selectedRows.some(
                                selected => selected.id === item.id
                            );

                            return (
                                <tr
                                    key={index}
                                    className={`hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""
                                        }`}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4 w-12">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    handleRowSelect(item)
                                                }
                                                aria-label="Select row"
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                    )}

                                    {columns.map(col => (
                                        <td
                                            key={col.key}
                                            className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : item[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}

                        {paginatedData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (selectable ? 1 : 0)
                                    }
                                    className="text-center py-6 text-gray-500"
                                >
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + pageSize, data.length)} of{" "}
                    {data.length} entries
                </div>

                <div className="flex space-x-2">
                    <button
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                        onClick={() => goToPage(page - 1)}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-3 py-1 rounded-md text-sm ${page === idx + 1
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-300 hover:bg-gray-50"
                                }`}
                            onClick={() => goToPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}

                    <button
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                        onClick={() => goToPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomTable;