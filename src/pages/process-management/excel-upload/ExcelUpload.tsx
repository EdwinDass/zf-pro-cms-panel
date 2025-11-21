import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

interface ExcelUploadProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ isOpen, onClose }) => {
    const [excelData, setExcelData] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const REQUIRED_HEADERS = ["redemption_ref", "status", "comments"];

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

                /** 🔥 NEW VALIDATION LOGIC:
                 * - Excel can have ANY number of columns
                 * - But MUST include all REQUIRED_HEADERS
                 */
                const headers = Object.keys(json[0]).map((h) => h.toLowerCase());

                const isValid = REQUIRED_HEADERS.every((required) =>
                    headers.includes(required)
                );

                if (!isValid) {
                    toast.error("Invalid Excel format. Please use the downloaded template.");
                    setIsProcessing(false);
                    return;
                }

                /** 🔥 NEW PROCESSING LOGIC:
                 * - Use ONLY required fields
                 * - Ignore extra fields
                 * - If approved/rejected and comments exist, include them
                 */
                const processed = json.map((row, index) => ({
                    id: `#EXCEL-${index + 1}`,
                    redemption_ref: row.redemption_ref,
                    status: row.status || "pending",
                    comments:
                        String(row.status).toLowerCase() === "rejected" ||
                            String(row.status).toLowerCase() === "approved"
                            ? row.comments || ""
                            : "",
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

    const handleSubmit = () => {
        console.log("Excel Data:", excelData);
        toast.success(`${excelData.length} records processed successfully`);
        handleClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">

                <div className="px-6 py-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-700">Upload Excel File</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Only Excel files with these headers are accepted:
                        <b>redemption_ref, status, comments</b>
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
                            <p className="text-sm text-gray-500 mt-4">
                                Only Excel formats accepted
                            </p>
                            {fileName && (
                                <p className="text-sm text-blue-600 mt-2 font-medium">
                                    Selected: {fileName}
                                </p>
                            )}
                            {isProcessing && (
                                <p className="text-sm text-orange-600 mt-2">Processing...</p>
                            )}
                        </div>
                    )}

                    {excelData.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            Redemption Ref
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            Comments
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {excelData.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                {row.redemption_ref}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${row.status.toLowerCase() === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : row.status.toLowerCase() === "approved"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {row.status.toLowerCase() === "rejected" ? (
                                                    row.comments || (
                                                        <span className="text-gray-400 italic">
                                                            No comment
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
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
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Submit {excelData.length} Records
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExcelUpload;