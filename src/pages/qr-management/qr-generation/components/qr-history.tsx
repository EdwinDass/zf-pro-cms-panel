// import React, { FC, useState } from "react";

// interface QRBatch {
//   batchId: number;
//   skuCode: string;
//   quantity: number;
//   fileUrl: string;
//   createdAt: string;
//   isActive: boolean;
// }

// interface QRBatchTableProps {
//   data: QRBatch[];
//   onView: (item: QRBatch) => void;
//   onDownload: (item: QRBatch) => void;
//   onDelete: (item: QRBatch) => void;
// }

// const QRBatchTable: FC<QRBatchTableProps> = ({
//   data,
//   onView,
//   onDownload,
//   onDelete,
// }) => {
//   const rowsPerPage = 5;                    // 🔥 SHOW 5 ROWS ONLY
//   const [page, setPage] = useState(1);      // current page

//   const totalPages = Math.ceil(data.length / rowsPerPage);

//   const startIndex = (page - 1) * rowsPerPage;
//   const visibleData = data.slice(startIndex, startIndex + rowsPerPage);

//   const goPrev = () => page > 1 && setPage(page - 1);
//   const goNext = () => page < totalPages && setPage(page + 1);

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-sm border">
//       <h2 className="text-xl font-semibold mb-6">QR Batches</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full text-left">
//           <thead>
//             <tr className="border-b text-gray-600 text-sm">
//               <th className="py-3 px-4">Batch ID</th>
//               <th className="py-3 px-4">SKU Code</th>
//               <th className="py-3 px-4">Quantity</th>
//               <th className="py-3 px-4">Generated Date</th>
//               <th className="py-3 px-4">Status</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {visibleData.map((row) => (
//               <tr key={row.batchId} className="border-b text-gray-800">
//                 <td className="py-3 px-4 font-semibold">B{row.batchId}</td>
//                 <td className="py-3 px-4">{row.skuCode}</td>
//                 <td className="py-3 px-4">{row.quantity.toLocaleString()}</td>
//                 <td className="py-3 px-4">{row.createdAt.split("T")[0]}</td>

//                 <td className="py-3 px-4">
//                   <span
//                     className={`
//                       px-3 py-1 rounded-full text-sm font-medium
//                       ${
//                         row.isActive
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-600"
//                       }
//                     `}
//                   >
//                     {row.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </td>

//                 <td className="py-3 px-4 flex gap-4">
//                   <button
//                     onClick={() => onView(row)}
//                     className="text-blue-600 hover:underline"
//                   >
//                     View
//                   </button>

//                   <button
//                     onClick={() => onDownload(row)}
//                     className="text-indigo-600 hover:underline"
//                   >
//                     Download
//                   </button>

//                   <button
//                     onClick={() => onDelete(row)}
//                     className="text-red-500 hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-end gap-4 mt-6">
//           <button
//             onClick={goPrev}
//             disabled={page === 1}
//             className={`px-4 py-2 rounded-lg border ${
//               page === 1
//                 ? "text-gray-400 border-gray-200"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             Previous
//           </button>

//           <span className="text-gray-600">
//             Page {page} of {totalPages}
//           </span>

//           <button
//             onClick={goNext}
//             disabled={page === totalPages}
//             className={`px-4 py-2 rounded-lg border ${
//               page === totalPages
//                 ? "text-gray-400 border-gray-200"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRBatchTable;


import React, { FC, useState } from "react";

export interface QRBatch {
    batchId: number;
    skuCode: string;
    quantity: number;
    fileUrl: string | null;
    createdAt: string;
    isActive: boolean;
}

interface QRBatchTableProps {
    data: QRBatch[];
    onDownload: (item: QRBatch) => void;
    page: number;
    totalPages: number;
    filters: {
        skuCode: string;
        fromDate: string;
        toDate: string;
    };
    onPageChange: (newPage: number) => void;
    onFilterChange: (name: string, value: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

const QRBatchTable: FC<QRBatchTableProps> = ({ 
    data, 
    onDownload, 
    page, 
    totalPages, 
    filters, 
    onPageChange, 
    onFilterChange, 
    onApplyFilters, 
    onClearFilters 
}) => {
    const goPrev = () => page > 1 && onPageChange(page - 1);
    const goNext = () => page < totalPages && onPageChange(page + 1);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-6">QR Batches</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">SKU Code</span>
                        {filters.skuCode && (
                            <button onClick={() => onFilterChange('skuCode', '')} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-0.5 transition-colors" title="Clear SKU Code">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <input type="text" placeholder="Enter SKU..." value={filters.skuCode} onChange={(e) => onFilterChange('skuCode', e.target.value)} className="w-full border p-2 rounded-lg" />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">From Date</span>
                        {filters.fromDate && (
                            <button onClick={() => onFilterChange('fromDate', '')} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-0.5 transition-colors" title="Clear From Date">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <input type="date" value={filters.fromDate} onChange={(e) => onFilterChange('fromDate', e.target.value)} className="w-full border p-2 rounded-lg" />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">To Date</span>
                        {filters.toDate && (
                            <button onClick={() => onFilterChange('toDate', '')} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-0.5 transition-colors" title="Clear To Date">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <input type="date" value={filters.toDate} onChange={(e) => onFilterChange('toDate', e.target.value)} className="w-full border p-2 rounded-lg" />
                </div>
            </div>
            
            <div className="flex justify-end gap-4 mb-6">
                <button onClick={onClearFilters} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">Clear</button>
                <button onClick={onApplyFilters} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply Filters</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-600 text-sm">
                            <th className="py-3 px-4">Batch ID</th>
                            <th className="py-3 px-4">SKU Code</th>
                            <th className="py-3 px-4">Quantity</th>
                            <th className="py-3 px-4">Generated Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Download</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((row) => (
                                <tr key={row.batchId} className="border-b text-gray-800">
                                    <td className="py-3 px-4 font-semibold">B{row.batchId}</td>
                                    <td className="py-3 px-4">{row.skuCode}</td>
                                    <td className="py-3 px-4">{row.quantity}</td>
                                    <td className="py-3 px-4">{row.createdAt.split("T")[0]}</td>

                                    <td className="py-3 px-4">
                                        <span
                                            className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${row.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                            }
                    `}
                                        >
                                            {row.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    {/* DOWNLOAD ONLY */}
                                    <td className="py-3 px-4">
                                        {row.fileUrl ? (
                                            <button
                                                onClick={() => onDownload(row)}
                                                className="text-indigo-600 font-medium hover:underline hover:text-indigo-800 transition-colors"
                                            >
                                                Download
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">
                                                In progress...
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    No QR batches found matching the filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-4 mt-6">
                    <button
                        onClick={goPrev}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg border ${page === 1
                            ? "text-gray-400 border-gray-200"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Previous
                    </button>

                    <span className="text-gray-600">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={goNext}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg border ${page === totalPages
                            ? "text-gray-400 border-gray-200"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRBatchTable;
