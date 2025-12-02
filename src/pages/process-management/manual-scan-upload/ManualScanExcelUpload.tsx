import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { bulkProductScan } from "../../../services/ApiService";

interface ScanExcelUploadProps {
    isOpen: boolean;
    onClose: () => void;
}

const ScanExcelUpload: React.FC<ScanExcelUploadProps> = ({ isOpen, onClose }) => {
    const [excelData, setExcelData] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadStage, setUploadStage] = useState<'select' | 'preview' | 'results'>('select');
    const [responseData, setResponseData] = useState<any>(null);
    if (!isOpen) return null;
    const REQUIRED_HEADERS = ["usercode", "qr"];

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
                    toast.error("Invalid Excel format. Required: userCode, qr");
                    setIsProcessing(false);
                    return;
                }

                const processed = json.map((row) => ({
                    userCode: row.userCode || "",
                    qr: row.qr || ""
                }));

                setExcelData(processed);
                setUploadStage('preview');
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
        setUploadStage('select');
        setResponseData(null);
        setFileName("");
        onClose();
    };

    const handleSubmit = async () => {
        try {
            const apiPayload = excelData.map(item => ({
                userCode: item.userCode,
                payload: { qr: item.qr }
            }));
            console.log("📤 SCAN EXCEL API PAYLOAD SENT:", apiPayload);
            const res = await bulkProductScan(apiPayload);
            console.log("📥 SCAN EXCEL API RESPONSE RECEIVED:", res);
            if (res?.code && res.code !== 200) {
                toast.error(res.message || "Bulk scan failed");
                return;
            }

            setResponseData(res.data);
            setUploadStage('results');

        } catch (error: any) {
            console.error("❗ SCAN EXCEL UPLOAD API ERROR:", error);
            toast.error(error?.response?.data?.message || "Failed to process upload");
        }
    };

    const handleBackToPreview = () => {
        setUploadStage('preview');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">

                <div className="px-6 py-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-700">Upload Excel File (Scan)</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Excel must contain headers: <b>userCode, qr</b>
                    </p>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {uploadStage === 'select' && (
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

                    {uploadStage === 'preview' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            User Code
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            QR Code
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
                                                {row.qr || <span className="text-gray-400 italic">No QR</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {uploadStage === 'results' && responseData && (
                        <div>
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700 mb-1">{responseData.message}</p>
                                <p className="text-sm text-gray-600">
                                    Success: <span className="font-semibold text-green-600">{responseData.successCount}</span> |
                                    Failed: <span className="font-semibold text-red-600">{responseData.failedCount}</span>
                                </p>
                            </div>

                            {responseData.successCount > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-900">Successful Scans</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        User Code
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        QR Code
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {responseData.success.map((item: any, index: number) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                            {item.userCode}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {item.qr}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                                Success
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {responseData.failedCount > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-900">Failed Scans</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        User Code
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        QR Code
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                        Error
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {responseData.failed.map((item: any, index: number) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                            {item.userCode}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {item.qr}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-red-600">
                                                            {item.error}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                        Close
                    </button>
                    {uploadStage === 'preview' && (
                        <button
                            onClick={handleSubmit}
                            disabled={isProcessing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                        >
                            {isProcessing ? "Processing..." : `Submit ${excelData.length} Records`}
                        </button>
                    )}
                    {uploadStage === 'results' && (
                        <button
                            onClick={handleBackToPreview}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                        >
                            Back to Preview
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ScanExcelUpload;