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

    // Generate page numbers with ellipsis for better mobile display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 3; // Show max 3 page numbers on mobile

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (page <= 3) {
                pageNumbers.push(1, 2, 3, '...', totalPages);
            } else if (page >= totalPages - 2) {
                pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(1, '...', page, '...', totalPages);
            }
        }
        return pageNumbers;
    };

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap ${col.className || ''}`}
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
                                    className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : ""}`}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4 w-12">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleRowSelect(item)}
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
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}

                        {paginatedData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    className="text-center py-6 text-gray-500"
                                >
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                {paginatedData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No data found
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {paginatedData.map((item, index) => {
                            const isSelected = selectedRows.some(
                                selected => selected.id === item.id
                            );

                            return (
                                <div
                                    key={index}
                                    className={`p-4 ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"} transition-colors`}
                                >
                                    {selectable && (
                                        <div className="flex items-center mb-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleRowSelect(item)}
                                                aria-label="Select row"
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Select
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {columns.map(col => (
                                            <div key={col.key} className="flex justify-between items-start">
                                                <span className="text-xs font-medium text-gray-500 uppercase flex-shrink-0 mr-2">
                                                    {col.label}:
                                                </span>
                                                <span className="text-sm text-gray-700 text-right flex-1">
                                                    {col.render ? col.render(item) : item[col.key]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 sm:px-6 py-4 border-t border-gray-200">
                {/* Results Info */}
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                    Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                        className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                    >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">
                            <i className="fas fa-chevron-left"></i>
                        </span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                        {getPageNumbers().map((pageNum, idx) => (
                            pageNum === '...' ? (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={idx}
                                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-colors ${page === pageNum
                                            ? "bg-blue-600 text-white"
                                            : "border border-gray-300 hover:bg-gray-50"
                                        }`}
                                    onClick={() => goToPage(pageNum as number)}
                                >
                                    {pageNum}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">
                            <i className="fas fa-chevron-right"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomTable;