import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { bulkRedeemPoints } from "../../../services/ApiService";

interface RedeemExcelUploadProps {
    isOpen: boolean;
    onClose: () => void;
}

const RedeemExcelUpload: React.FC<RedeemExcelUploadProps> = ({ isOpen, onClose }) => {
    const [excelData, setExcelData] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    // required excel headers
    const REQUIRED_HEADERS = ["usercode", "type", "value"];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: "binary" });

                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                if (json.length === 0) {
                    toast.error("Excel file is empty");
                    setIsProcessing(false);
                    return;
                }

                const headers = Object.keys(json[0]).map((h) => h.toLowerCase());
                const isValid = REQUIRED_HEADERS.every((required) =>
                    headers.includes(required)
                );

                if (!isValid) {
                    toast.error("Invalid Excel format. Required: userCode, type, value");
                    setIsProcessing(false);
                    return;
                }

                const processed = json.map((row) => ({
                    userCode: row.userCode || "",
                    type: row.type || "",
                    value: row.value || ""
                }));

                setExcelData(processed);
                setIsProcessing(false);
            } catch (error) {
                console.error(error);
                toast.error("Error processing Excel file.");
                setIsProcessing(false);
            }
        };

        reader.readAsBinaryString(file);
    };

    const handleClose = () => {
        setExcelData([]);
        setFileName("");
        onClose();
    };

    const handleSubmit = async () => {
        try {
            const apiPayload = excelData.map(item => ({
                userCode: item.userCode,
                payload: { 
                    type: item.type, 
                    value: Number(item.value) 
                }
            }));

            console.log("📤 REDEEM EXCEL API PAYLOAD SENT:", apiPayload);
            const res = await bulkRedeemPoints(apiPayload);
            console.log("📥 REDEEM EXCEL API RESPONSE RECEIVED:", res);

            if (res?.code && res.code !== 200) {
                toast.error(res.message || "Bulk redemption failed");
                return;
            }

            if (res?.data?.failed?.length > 0) {
                res.data.failed.forEach((err: any) => {
                    toast.error(`${err.userCode} — ${err.error || err.message}`);
                });
            }

            toast.success(res?.data?.message || res?.message || `Bulk redemption processed successfully (${res?.data?.successCount || 0} success, ${res?.data?.failedCount || 0} failed)`);

            handleClose();

        } catch (error: any) {
            console.error("❗ REDEEM EXCEL UPLOAD API ERROR:", error);
            toast.error(error?.response?.data?.message || "Failed to process upload");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">

                <div className="px-6 py-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-700">Upload Excel File (Redemption)</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Excel must contain headers: <b>userCode, type, value</b>
                    </p>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {excelData.length === 0 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition">
                            <div className="mb-4">
                                <i className="fas fa-file-excel text-6xl text-green-500"></i>
                            </div>
                            <label className="cursor-pointer">
                                <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block">
                                    Choose Excel File
                                </span>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}

                    {excelData.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            User Code
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            Value
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {excelData.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                {row.userCode}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {row.type || <span className="text-gray-400 italic">No type</span>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {row.value || <span className="text-gray-400 italic">No value</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>

                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                        Cancel
                    </button>
                    {excelData.length > 0 && (
                        <button
                            onClick={handleSubmit}
                            disabled={isProcessing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                        >
                            {isProcessing ? "Processing..." : `Submit ${excelData.length} Records`}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RedeemExcelUpload;