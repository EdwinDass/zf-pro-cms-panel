import React, { useState, useRef, useEffect } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import ConfirmRedemption from "../confirm-redemption/ConfirmRedemption";
import ExcelUpload from "../excel-upload/ExcelUpload";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { getRedemptionHistory, updateRedemptionStatus } from "../../../services/ApiService";

interface ScanRequest {
    id: string;
    slno: number;
    redemptionRef: string;
    userName: string;
    userRole: string;
    redeemedPoints: string;
    createdAt: string;
    redemptionMode: string;
    redemptionStatus: string;
}

const ScanRequests: React.FC = () => {
    const [data, setData] = useState<ScanRequest[]>([]);
    const [selectedRows, setSelectedRows] = useState<ScanRequest[]>([]);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [currentAction, setCurrentAction] = useState<"approve" | "reject">("approve");
    const [showExcelUpload, setShowExcelUpload] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    // Pagination
    const [skip, setSkip] = useState(0);
    const limit = 10;
    const [totalCount, setTotalCount] = useState(0);

    const fetchRedemptionHistory = async () => {
        try {
            setLoading(true);
            const payload: any = {
                status: ["Pending"],
                skip,
                limit
            };
            console.log("📤 API PAYLOAD SENT:", payload);
            const res = await getRedemptionHistory(payload);
            console.log("📥 API RESPONSE RECEIVED:", res);
            const formatted: ScanRequest[] = res.data.reportList.map((item: any) => ({
                id: item.redemptionRef,
                slno: item.slno,
                redemptionRef: item.redemptionRef,
                userName: item.userName,
                userRole: item.userRole,
                redeemedPoints: item.redeemedPoints,
                createdAt: item.createdAt,
                redemptionMode: item.redemptionMode,
                redemptionStatus: item.redemptionStatus,
            }));
            setData(formatted);
            setTotalCount(res.data.totalCount);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        fetchRedemptionHistory();
    }, [skip]);

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

    const handleConfirm = async (comments: { [key: string]: string }) => {
        try {
            const apiPayload = {
                payload: selectedRows.map(item => ({
                    redemptionRef: item.redemptionRef,
                    status: currentAction === "approve" ? "Approve" : "Reject",
                    comment: currentAction === "reject" ? (comments[item.redemptionRef] || "") : ""
                }))
            };

            console.log("📤 APPROVE/REJECT API PAYLOAD:", apiPayload);

            const res = await updateRedemptionStatus(apiPayload);

            console.log("📥 APPROVE/REJECT RESPONSE:", res);

            toast.success(
                `${selectedRows.length} request(s) ${currentAction === "approve" ? "approved" : "rejected"
                } successfully!`
            );

            setShowConfirmPopup(false);
            setSelectedRows([]);
            fetchRedemptionHistory();

        } catch (error: any) {
            console.error("❗ API ERROR:", error);
            toast.error(error?.response?.data?.message || "Failed to process request");
        }
    };


    const downloadExcelFormat = () => {
        const ws = XLSX.utils.json_to_sheet([], {
            header: ["redemptionRef", "status", "comments"]
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Format");
        XLSX.writeFile(wb, "redemption_format.xlsx");
    };

    const columns: Column[] = [
        { key: "slno", label: "SL No" },
        { key: "redemptionRef", label: "Redemption Ref" },
        { key: "userName", label: "User Name" },
        { key: "userRole", label: "Role" },
        { key: "redeemedPoints", label: "Points" },
        { key: "createdAt", label: "Created At" },
        { key: "redemptionMode", label: "Mode" },
        { key: "redemptionStatus", label: "Status" },
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
                                aria-label="More options"
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
                    pageSize={limit}
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