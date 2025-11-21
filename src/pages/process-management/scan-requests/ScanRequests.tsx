import React, { useState, useRef } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import ConfirmRedemption from "../confirm-redemption/ConfirmRedemption";
import ExcelUpload from "../excel-upload/ExcelUpload";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

interface ScanRequest {
    id: string;
    userName: string;
    initials: string;
    color: string;
    amount: string;
    status: string;
}

const ScanRequests: React.FC = () => {
    const [selectedRows, setSelectedRows] = useState<ScanRequest[]>([]);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [currentAction, setCurrentAction] = useState<"approve" | "reject">("approve");
    const [showExcelUpload, setShowExcelUpload] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const data: ScanRequest[] = [
        {
            id: "#REQ-2847",
            userName: "John Doe",
            initials: "JD",
            color: "bg-blue-500",
            amount: "₹2,500",
            status: "Pending"
        },
        {
            id: "#REQ-2848",
            userName: "Alice Smith",
            initials: "AS",
            color: "bg-green-500",
            amount: "₹5,200",
            status: "Pending"
        },
        {
            id: "#REQ-2849",
            userName: "Robert Johnson",
            initials: "RJ",
            color: "bg-purple-500",
            amount: "₹1,800",
            status: "Pending"
        },
        {
            id: "#REQ-2850",
            userName: "Emma Wilson",
            initials: "EW",
            color: "bg-yellow-500",
            amount: "₹3,750",
            status: "Pending"
        },
        {
            id: "#REQ-2851",
            userName: "Michael Brown",
            initials: "MB",
            color: "bg-red-500",
            amount: "₹4,100",
            status: "Pending"
        },
        {
            id: "#REQ-2852",
            userName: "Sarah Davis",
            initials: "SD",
            color: "bg-indigo-500",
            amount: "₹2,900",
            status: "Pending"
        },
    ];

    const handleApprove = () => {
        if (selectedRows.length === 0) {
            toast.error("Please select at least one request");
            return;
        }
        setCurrentAction("approve");
        setShowConfirmPopup(true);
    };

    const handleReject = () => {
        if (selectedRows.length === 0) {
            toast.error("Please select at least one request");
            return;
        }

        setCurrentAction("reject");
        setShowConfirmPopup(true);
    };

    const exportData = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Scan Requests");
        XLSX.writeFile(wb, "process_redemption.xlsx");
    };


    const handleConfirm = (comments: { [key: string]: string }) => {
        console.log("Action:", currentAction);
        console.log("Selected:", selectedRows);
        console.log("Comments:", comments);

        toast.success(`${selectedRows.length} request(s) ${currentAction === "approve" ? "approved" : "rejected"
            } successfully!`);

        setShowConfirmPopup(false);
        setSelectedRows([]);
    };

    const downloadExcelFormat = () => {
        const ws = XLSX.utils.json_to_sheet([], { header: ["redemption_ref", "status", "comments"] });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Format");
        XLSX.writeFile(wb, "redemption_format.xlsx");
    };

    const columns: Column[] = [
        { key: "id", label: "Redemption Ref" },
        {
            key: "user",
            label: "User Name",
            render: (row: ScanRequest) => (
                <div className="flex items-center">
                    <div
                        className={`w-10 h-10 rounded-full ${row.color} flex justify-center items-center text-white font-semibold`}
                    >
                        {row.initials}
                    </div>
                    <div className="ml-3 font-medium text-gray-900">{row.userName}</div>
                </div>
            ),
        },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
    ];

    return (
        <div>
            {/* Action Buttons + Menu */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Pending Redemption Requests</h3>
                        {selectedRows.length > 0 && (
                            <p className="text-sm text-blue-600 mt-1">
                                {selectedRows.length} selected
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 relative">
                        <button
                            onClick={handleApprove}
                            disabled={selectedRows.length === 0}
                            className={`px-3 py-1 bg-green-600 text-white text-sm rounded-lg transition ${selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                                }`}
                        >
                            Approve
                        </button>

                        <button
                            onClick={handleReject}
                            disabled={selectedRows.length === 0}
                            className={`px-3 py-1 bg-red-600 text-white text-sm rounded-lg transition ${selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                                }`}
                        >
                            Reject
                        </button>

                        <button
                            onClick={() => exportData()}
                            className="px-3 py-1 bg-white border border-black text-black text-sm rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition"
                        >
                            <i className="fas fa-download"></i>
                            <span>Export</span>
                        </button>



                        {/* 3 DOTS MENU */}
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="More options"  // Accessible name
                                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <i className="fas fa-ellipsis-v"></i>
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border py-2 z-50">
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setShowExcelUpload(true);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Upload Excel
                                    </button>

                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            downloadExcelFormat();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Download Format
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <CustomTable
                    columns={columns}
                    data={data}
                    pageSize={4}
                    selectable
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                />
            </div>

            <ConfirmRedemption
                isOpen={showConfirmPopup}
                onClose={() => setShowConfirmPopup(false)}
                selectedData={selectedRows}
                action={currentAction}
                onConfirm={handleConfirm}
            />

            <ExcelUpload
                isOpen={showExcelUpload}
                onClose={() => setShowExcelUpload(false)}
            />
        </div>
    );
};

export default ScanRequests;