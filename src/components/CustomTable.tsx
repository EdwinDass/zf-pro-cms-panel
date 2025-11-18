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
}

const CustomTable: React.FC<TableComponentProps> = ({
    columns,
    data,
    pageSize = 5,
}) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
    };

    return (
          <div className="bg-white rounded-xl shadow border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg">
            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase ${col.className}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                                        {col.render
                                            ? col.render(item)
                                            : item[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {paginatedData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length}
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