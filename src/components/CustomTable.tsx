import React from "react";

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
    totalRows?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;

    selectable?: boolean;
    selectedRows?: any[];
    onSelectionChange?: (selected: any[]) => void;
}

const CustomTable: React.FC<TableComponentProps> = ({
    columns,
    data,
    pageSize = 10,
    totalRows = 0,
    currentPage = 1,
    onPageChange,

    selectable = false,
    selectedRows = [],
    onSelectionChange,
}) => {

    // Backend-based total pages
    const totalPages = Math.ceil(totalRows / pageSize);

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        if (onPageChange) onPageChange(p);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pageNumbers.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(1, '...', currentPage, '...', totalPages);
            }
        }
        return pageNumbers;
    };

    // OLD LOGIC: ID-based selection (correct approach)
    const isAllSelected =
        data.length > 0 &&
        data.every(item =>
            selectedRows.some(selected => selected.id === item.id)
        );

    const handleSelectAll = () => {
        if (!onSelectionChange) return;

        if (isAllSelected) {
            const remaining = selectedRows.filter(
                selected => !data.some(item => item.id === selected.id)
            );
            onSelectionChange(remaining);
        } else {
            const newItems = data.filter(
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
        <div className="bg-white rounded-xl shadow border border-gray-100">

            {/* DESKTOP TABLE */}
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
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    className="text-center py-6 text-gray-500"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => {
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
                                                    aria-label={`Select row for ID ${item.id}`}
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
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* MOBILE */}
            <div className="md:hidden">
                {data.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No data found</div>
                ) : (
                    data.map((item, index) => {
                        const isSelected = selectedRows.some(
                            selected => selected.id === item.id
                        );

                        return (
                            <div
                                key={index}
                                className={`p-4 border-b transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                            >
                                {selectable && (
                                    <div className="flex items-center mb-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleRowSelect(item)}
                                            aria-label={`Select row for ID ${item.id}`}
                                        />

                                        <span className="ml-2">Select</span>
                                    </div>
                                )}

                                {columns.map(col => (
                                    <div key={col.key} className="flex justify-between py-1">
                                        <span className="text-xs text-gray-500">{col.label}</span>
                                        <span className="text-sm">
                                            {col.render ? col.render(item) : item[col.key]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">

                <span className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * pageSize + 1}–
                    {(currentPage - 1) * pageSize + data.length} of {totalRows} entries
                </span>

                <div className="flex items-center space-x-1">
                    <button
                        className="px-3 py-1 border rounded-md text-sm"
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        Previous
                    </button>

                    {getPageNumbers().map((pg, index) =>
                        pg === "..." ? (
                            <span key={index} className="px-2 py-1 text-gray-500">
                                ...
                            </span>
                        ) : (
                            <button
                                key={index}
                                className={`px-3 py-1 border rounded-md text-sm ${currentPage === pg ? "bg-blue-600 text-white" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => goToPage(pg as number)}
                            >
                                {pg}
                            </button>
                        )
                    )}

                    <button
                        className="px-3 py-1 border rounded-md text-sm"
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomTable;