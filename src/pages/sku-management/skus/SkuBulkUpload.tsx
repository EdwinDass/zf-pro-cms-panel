import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { addBulkSkus } from "../../../services/ApiService";

interface SkuBulkUploadProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: () => void;
}

const SkuBulkUpload: React.FC<SkuBulkUploadProps> = ({ isOpen, onClose, onUpload }) => {
    const [excelData, setExcelData] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadStage, setUploadStage] = useState<'select' | 'preview' | 'results'>('select');
    const [responseData, setResponseData] = useState<any>(null);

    const [activeResultTab, setActiveResultTab] = useState<'success' | 'failed'>('failed');

    if (!isOpen) return null;

    const REQUIRED_HEADERS_KEYS = [
        "subCategoryName", "skuName", "skuCode", "productValue", "points"
    ];
    const REQUIRED_HEADERS_LOWER = REQUIRED_HEADERS_KEYS.map(h => h.toLowerCase());

    const handleDownloadSample = () => {
        const sampleData = [
            {
                subCategoryName: "Phones",
                skuName: "iPhone 15",
                skuCode: "IP15",
                productValue: "999.00",
                points: "50.00"
            },
            {
                subCategoryName: "Desks",
                skuName: "Standing Desk",
                skuCode: "SD01",
                productValue: "299.99",
                points: "15.00"
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SKUs");
        XLSX.writeFile(workbook, "SKU_Bulk_Upload_Sample.xlsx");
    };

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

                const fileHeaders = Object.keys(json[0]);
                const fileHeadersLower = fileHeaders.map(h => h.toLowerCase());

                const missingHeaders = REQUIRED_HEADERS_LOWER.filter((required) => !fileHeadersLower.includes(required));

                // Must have at least subCategoryName, skuName, and skuCode
                const criticalHeaders = ["subcategoryname", "skuname", "skucode"];
                const missingCritical = criticalHeaders.filter(h => !fileHeadersLower.includes(h));

                if (missingCritical.length > 0) {
                    toast.error(`Missing critical headers: ${missingCritical.join(", ")}`);
                    setIsProcessing(false);
                    return;
                }

                if (missingHeaders.length > 0) {
                    toast.warn(`Note: Missing optional headers: ${missingHeaders.join(", ")}`);
                }

                const normalizedData = json.map(row => {
                    const newRow: any = {};
                    REQUIRED_HEADERS_KEYS.forEach(key => {
                        const actualKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
                        if (actualKey && row[actualKey] !== undefined && row[actualKey] !== null) {
                            newRow[key] = String(row[actualKey]).trim();
                        } else {
                            newRow[key] = "";
                        }
                    });

                    return newRow;
                });

                setExcelData(normalizedData);
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
        setFileName("");
        setUploadStage('select');
        setResponseData(null);
        setActiveResultTab('failed');
        onClose();
        if (uploadStage === 'results' && responseData?.data?.summary?.created > 0) {
            onUpload();
        }
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        try {
            const res = await addBulkSkus(excelData);
            const body = res.data;
            setResponseData(body);
            setUploadStage('results');

            if (body?.data?.summary?.failed === 0) {
                setActiveResultTab('success');
            } else {
                setActiveResultTab('failed');
            }
            toast.success(body?.message || "SKUs processed");
        } catch (error: any) {
            console.error("❗ EXCEL UPLOAD ERROR:", error);
            const errorBody = error.response?.data;
            if (errorBody?.data?.results) {
                setResponseData(errorBody);
                setUploadStage('results');
                setActiveResultTab('failed');
                toast.error(errorBody?.message || "Upload completed with errors");
            } else {
                toast.error("Failed to process upload");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBackToPreview = () => {
        setUploadStage('preview');
        setResponseData(null);
    };

    const summary = responseData?.data?.summary || { total: 0, created: 0, failed: 0 };
    const results = responseData?.data?.results || [];

    const successRecords = results.filter((r: any) => r.status === 'created' || r.status === 'success');
    const failedRecords = results.filter((r: any) => r.status === 'failed' || r.status === 'error');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">

                <div className="px-6 py-4 border-b bg-blue-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-blue-700">Bulk Upload SKUs</h2>
                        <p className="text-xs text-gray-600 mt-1">
                            {uploadStage === 'select' && "Upload your Excel file"}
                            {uploadStage === 'preview' && `Previewing ${excelData.length} records`}
                            {uploadStage === 'results' && "Upload Results"}
                        </p>
                    </div>
                    {uploadStage === 'select' && (
                        <div className="text-xs text-gray-500 text-right">
                            <button
                                onClick={handleDownloadSample}
                                className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded border border-green-200 transition"
                            >
                                <i className="fas fa-download mr-1"></i> Download Sample Format
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {uploadStage === 'select' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition h-full flex flex-col justify-center items-center">
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
                            <p className="mt-4 text-sm text-gray-500">Supported formats: .xlsx, .xls</p>
                        </div>
                    )}

                    {uploadStage === 'preview' && excelData.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {REQUIRED_HEADERS_KEYS.map((key) => (
                                            <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {excelData.slice(0, 100).map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            {REQUIRED_HEADERS_KEYS.map((key) => (
                                                <td key={key} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
                                                    {row[key] !== undefined && row[key] !== "" ? row[key] : "-"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {excelData.length > 100 && (
                                <p className="text-center text-gray-500 mt-4 text-sm italic">
                                    Showing first 100 of {excelData.length} records
                                </p>
                            )}
                        </div>
                    )}

                    {uploadStage === 'results' && responseData && (
                        <div className="h-full flex flex-col">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center justify-between cursor-pointer" onClick={() => setActiveResultTab('success')}>
                                    <div>
                                        <p className="text-sm text-green-600 font-medium">Successfully Created</p>
                                        <p className="text-2xl font-bold text-green-700">{summary.created}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${activeResultTab === 'success' ? 'bg-green-200 text-green-700 ring-2 ring-green-400' : 'bg-green-100 text-green-500'}`}>
                                        <i className="fas fa-check"></i>
                                    </div>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center justify-between cursor-pointer" onClick={() => setActiveResultTab('failed')}>
                                    <div>
                                        <p className="text-sm text-red-600 font-medium">Failed</p>
                                        <p className="text-2xl font-bold text-red-700">{summary.failed}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${activeResultTab === 'failed' ? 'bg-red-200 text-red-700 ring-2 ring-red-400' : 'bg-red-100 text-red-500'}`}>
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs Header */}
                            <div className="flex border-b mb-4">
                                <button
                                    className={`px-6 py-2 text-sm font-medium transition-colors ${activeResultTab === 'failed' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveResultTab('failed')}
                                >
                                    Failed Records ({summary.failed})
                                </button>
                                <button
                                    className={`px-6 py-2 text-sm font-medium transition-colors ${activeResultTab === 'success' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveResultTab('success')}
                                >
                                    Successful Records ({summary.created})
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-auto">
                                {activeResultTab === 'success' && (
                                    <>
                                        {successRecords.length > 0 ? (
                                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SKU Name</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SKU Code</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SKU ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {successRecords.map((item: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm text-gray-900">{item.data?.skuName || item.skuName || '-'}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.skuCode || item.data?.skuCode}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-500 font-mono">{item.data?.skuId || item.data?.id || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center py-10 text-gray-500">No successful records</div>
                                        )}
                                    </>
                                )}

                                {activeResultTab === 'failed' && (
                                    <>
                                        {failedRecords.length > 0 ? (
                                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase max-w-xs">Error Message</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SKU Name</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SKU Code</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {failedRecords.map((item: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-red-50">
                                                            <td className="px-4 py-3 text-sm text-red-600 font-medium whitespace-normal max-w-xs">{item.error}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">{item.skuName || "N/A"}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.skuCode || "N/A"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center py-10 text-gray-500">No failed records</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                        {uploadStage === 'results' ? "Close" : "Cancel"}
                    </button>
                    {uploadStage === 'preview' && (
                        <button
                            onClick={handleSubmit}
                            disabled={isProcessing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center"
                        >
                            {isProcessing && <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>}
                            Submit {excelData.length} Records
                        </button>
                    )}
                    {uploadStage === 'results' && (
                        <button
                            onClick={handleBackToPreview}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                        >
                            <i className="fas fa-arrow-left mr-2"></i> Back to Preview
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SkuBulkUpload;
