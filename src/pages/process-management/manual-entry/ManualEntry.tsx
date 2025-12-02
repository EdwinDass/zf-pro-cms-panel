import React, { useState } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import { toast } from "react-toastify";
import { bulkProductScan, bulkRedeemPoints } from "../../../services/ApiService";
import * as XLSX from "xlsx";
import ScanExcelUpload from "../manual-scan-upload/ManualScanExcelUpload";
import RedeemExcelUpload from "../manual-redemption-excel-upload/ManualRedemptionExcelUpload";


interface ManualEntryRow {
    id: string;
    userName: string;
    initials: string;
    color: string;
    type: string;
    amount: string;
    datetime: string;
}

const ManualEntry: React.FC = () => {

    const [scanUserCode, setScanUserCode] = useState("");
    const [scanQR, setScanQR] = useState("");
    const [loading, setLoading] = useState(false);
    const [redeemUserCode, setRedeemUserCode] = useState("");
    const [redeemType, setRedeemType] = useState("");
    const [redeemValue, setRedeemValue] = useState("");
    const [menuOpenScan, setMenuOpenScan] = useState(false);
    const [showScanExcelUpload, setShowScanExcelUpload] = useState(false);
    const [menuOpenRedeem, setMenuOpenRedeem] = useState(false);
    const [showRedeemExcelUpload, setShowRedeemExcelUpload] = useState(false);

    const handleSubmitScan = async () => {
        if (!scanUserCode || !scanQR) {
            return toast.error("Please fill all fields");
        }
        const payload = [
            {
                userCode: scanUserCode,
                payload: { qr: scanQR }
            }
        ];
        setLoading(true);
        try {
            const response = await bulkProductScan(payload);
            if (response?.data?.failedCount > 0) {
                response.data.failed.forEach((err: any) => {
                    toast.error(`${err.userCode} — ${err.error}`);
                });
            }
            if (response?.data?.successCount > 0) {
                toast.success(response.message || "Bulk scan processed successfully");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Scan failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRedemption = async () => {
        if (!redeemUserCode || !redeemType || !redeemValue) {
            return toast.error("Please fill all fields");
        }
        const payload = [
            {
                userCode: redeemUserCode,
                payload: { type: redeemType, value: Number(redeemValue) }
            }
        ];
        setLoading(true);
        try {
            const response = await bulkRedeemPoints(payload);
            if (response?.code && response?.code !== 200) {
                toast.error(response.message);
                return;
            }
            toast.success(response?.message || "Redemption successful");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Redemption failed");
        } finally {
            setLoading(false);
        }
    };

    const downloadScanFormat = () => {
        const ws = XLSX.utils.json_to_sheet([], {
            header: ["userCode", "qr"]
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Format");
        XLSX.writeFile(wb, "scan_format.xlsx");
    };

    const downloadRedeemFormat = () => {
        const ws = XLSX.utils.json_to_sheet([], {
            header: ["userCode", "type", "value"]
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Format");
        XLSX.writeFile(wb, "redeem_format.xlsx");
    };

    const columns: Column[] = [
        { key: "id", label: "Entry ID" },
        {
            key: "user",
            label: "User",
            render: (row: ManualEntryRow) => (
                <div className="flex items-center">
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${row.color}`}
                    >
                        {row.initials}
                    </div>
                    <span className="ml-3 text-gray-800 font-medium">
                        {row.userName}
                    </span>
                </div>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (row: ManualEntryRow) => {
                const badgeColor =
                    row.type === "Scan"
                        ? "bg-blue-100 text-blue-600"
                        : row.type === "Redemption"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700";
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                        {row.type}
                    </span>
                );
            },
        },
        { key: "amount", label: "Amount/Points" },
        { key: "datetime", label: "Date/Time" },
        {
            key: "status",
            label: "Status",
            render: () => (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Completed
                </span>
            ),
        },
    ];

    const recentEntries: ManualEntryRow[] = [
        {
            id: "#MAN-1024",
            userName: "John Doe",
            initials: "JD",
            color: "bg-blue-100 text-blue-700",
            type: "Scan",
            amount: "₹1,500",
            datetime: "Oct 25, 2023 11:15 AM",
        },
        {
            id: "#MAN-1025",
            userName: "Alice Smith",
            initials: "AS",
            color: "bg-green-100 text-green-700",
            type: "Redemption",
            amount: "800 Points",
            datetime: "Oct 25, 2023 10:45 AM",
        },
        {
            id: "#MAN-1026",
            userName: "Robert Johnson",
            initials: "RJ",
            color: "bg-purple-100 text-purple-700",
            type: "Transaction",
            amount: "₹3,200",
            datetime: "Oct 24, 2023 04:30 PM",
        },
    ];

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT BOX — Manual Scan Entry */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Manual Scan Entry
                        </h3>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpenScan(!menuOpenScan)}
                                aria-label="More options"
                                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <i className="fas fa-ellipsis-v"></i>
                            </button>
                            {menuOpenScan && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border py-2 z-50">
                                    <button
                                        onClick={() => {
                                            setMenuOpenScan(false);
                                            setShowScanExcelUpload(true);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Upload Excel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMenuOpenScan(false);
                                            downloadScanFormat();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Download Format
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <label htmlFor="scanUserCode" className="block text-sm text-gray-700 mb-1">
                        User Code
                    </label>
                    <input
                        id="scanUserCode"
                        type="text"
                        placeholder="Enter user code"
                        value={scanUserCode}
                        aria-label="User Code"
                        onChange={(e) => setScanUserCode(e.target.value)}
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />
                    <label htmlFor="scanType" className="block text-sm text-gray-700 mb-1">
                        Transaction Type
                    </label>
                    <input
                        id="scanType"
                        type="text"
                        value="Scan"
                        aria-label="Transaction Type"
                        disabled
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm bg-gray-100 text-gray-600"
                    />
                    <label htmlFor="scanQR" className="block text-sm text-gray-700 mb-1">
                        QR Code
                    </label>
                    <input
                        id="scanQR"
                        type="text"
                        placeholder="Enter QR code"
                        value={scanQR}
                        aria-label="QR Code"
                        onChange={(e) => setScanQR(e.target.value)}
                        className="w-full border rounded-md px-4 py-2 mb-6 text-sm"
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmitScan}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit Entry"}
                        </button>
                    </div>
                </div>
                {/* RIGHT BOX — Manual Redemption Entry */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Manual Redemption Entry
                        </h3>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpenRedeem(!menuOpenRedeem)}
                                aria-label="More options"
                                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <i className="fas fa-ellipsis-v"></i>
                            </button>
                            {menuOpenRedeem && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border py-2 z-50">
                                    <button
                                        onClick={() => {
                                            setMenuOpenRedeem(false);
                                            setShowRedeemExcelUpload(true);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Upload Excel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMenuOpenRedeem(false);
                                            downloadRedeemFormat();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Download Format
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <label htmlFor="redeemUserCode" className="block text-sm text-gray-700 mb-1">
                        User Code
                    </label>
                    <input
                        id="redeemUserCode"
                        type="text"
                        placeholder="Enter user code"
                        value={redeemUserCode}
                        aria-label="Redemption User Code"
                        onChange={(e) => setRedeemUserCode(e.target.value)}
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />
                    <label htmlFor="redeemTypeStatic" className="block text-sm text-gray-700 mb-1">
                        Transaction Type
                    </label>
                    <input
                        id="redeemTypeStatic"
                        type="text"
                        value="Redemption"
                        aria-label="Transaction Type"
                        disabled
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm bg-gray-100 text-gray-600"
                    />
                    <label htmlFor="redeemType" className="block text-sm text-gray-700 mb-1">
                        Redemption Type
                    </label>
                    <select
                        id="redeemType"
                        aria-label="Redemption Type"
                        value={redeemType}
                        onChange={(e) => setRedeemType(e.target.value)}
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    >
                        <option value="">Select Type</option>
                        <option value="upi">UPI</option>
                        <option value="bank-transfer">Bank Transfer</option>
                    </select>
                    <label htmlFor="redeemValue" className="block text-sm text-gray-700 mb-1">
                        Redemption Value (₹)
                    </label>
                    <input
                        id="redeemValue"
                        type="number"
                        placeholder="Enter redemption value"
                        value={redeemValue}
                        aria-label="Redemption Value"
                        onChange={(e) => setRedeemValue(e.target.value)}
                        className="w-full border rounded-md px-4 py-2 mb-4 text-sm"
                    />
                    <div className="flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitRedemption}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit Entry"}
                        </button>
                    </div>
                </div>
            </div>
            {/* =============================
                ❗ RECENT MANUAL ENTRIES HIDDEN
            ============================== */}
            {/*
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Manual Entries</h3>
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                        View All
                    </button>
                </div>
                <CustomTable
                    pageSize={5}
                    columns={columns}
                    data={recentEntries}
                />
            </div>
            */}
        
            <ScanExcelUpload
                isOpen={showScanExcelUpload}
                onClose={() => setShowScanExcelUpload(false)}
            />
            <RedeemExcelUpload
                isOpen={showRedeemExcelUpload}
                onClose={() => setShowRedeemExcelUpload(false)}
            />
        </div>
    );
};

export default ManualEntry;