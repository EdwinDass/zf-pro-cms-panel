import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import {
    getWorkshops,
    getWorkshopById,
    bulkCreateWorkshops,
    updateWorkshop,
} from "../../../../services/ApiService";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Workshop {
    retailerId: number;
    storeName: string;
    retailerName: string;
    mobileNumber: string;
    currentAddress: string | null;
    currentPincode: number;
    gstNumber: string | null;
    stateName: string | null;
    districtName: string | null;
    cityName: string | null;
    createdAt: string;
}

type UploadStage = "select" | "preview" | "results";

// ─── Excel Column Label → API key mapping ──────────────────────────────────────

const EXCEL_COLUMNS = [
    { label: "Workshop Name", key: "store_name" },
    { label: "Workshop Owner Name", key: "retailer_name" },
    { label: "Mobile Number", key: "mobile_number" },
    { label: "Current Address", key: "current_address" },
    { label: "Current Pincode", key: "current_pincode" },
];

// ─── Workshop Detail Modal ──────────────────────────────────────────────────────

const WorkshopDetailModal: React.FC<{
    workshopId: number;
    onClose: () => void;
}> = ({ workshopId, onClose }) => {
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getWorkshopById(workshopId);
                // Backend returns: { message, code, data: { workshopObj } }
                if (res?.data?.data) setWorkshop(res.data.data);
                else if (res?.data) setWorkshop(res.data as any);
            } catch {
                toast.error("Failed to load workshop details");
            } finally {
                setLoading(false);
            }
        })();
    }, [workshopId]);

    const field = (label: string, value: any) => (
        <div className="py-2 border-b border-gray-100 last:border-0 flex gap-4">
            <span className="text-xs font-semibold text-gray-500 uppercase w-44 shrink-0">{label}</span>
            <span className="text-sm text-gray-800 font-medium">{value || "—"}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <StorefrontIcon className="text-white" />
                        <h2 className="text-white font-bold text-lg">Workshop Details</h2>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-blue-200 transition">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        </div>
                    ) : workshop ? (
                        <div>
                            {field("Workshop ID", workshop.retailerId)}
                            {field("Workshop Name", workshop.storeName)}
                            {field("Workshop Owner Name", workshop.retailerName)}
                            {field("Mobile Number", workshop.mobileNumber)}
                            {field("Address", workshop.currentAddress)}
                            {field("Pincode", workshop.currentPincode)}
                            {field("City", workshop.cityName)}
                            {field("District", workshop.districtName)}
                            {field("State", workshop.stateName)}
                            {field("GST Number", workshop.gstNumber)}
                            {field("Created At", workshop.createdAt ? new Date(workshop.createdAt).toLocaleString() : "—")}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-6">Workshop not found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Edit Workshop Modal ────────────────────────────────────────────────────────

const EditWorkshopModal: React.FC<{
    workshop: Workshop;
    onClose: () => void;
    onSuccess: (updated: Workshop) => void;
}> = ({ workshop, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        store_name: workshop.storeName,
        retailer_name: workshop.retailerName,
        mobile_number: workshop.mobileNumber,
        current_address: workshop.currentAddress || "",
        current_pincode: String(workshop.currentPincode),
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const MOBILE_RE = /^[6-9]\d{9}$/;

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.store_name.trim()) e.store_name = "Workshop name is required";
        if (!form.retailer_name.trim()) e.retailer_name = "Owner name is required";
        if (!form.mobile_number.trim()) {
            e.mobile_number = "Mobile number is required";
        } else if (!MOBILE_RE.test(form.mobile_number.trim())) {
            e.mobile_number = "Must be a 10-digit Indian mobile number (starts with 6-9)";
        }
        if (!form.current_address.trim()) {
            e.current_address = "Address is required";
        }
        if (!form.current_pincode.trim()) {
            e.current_pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(form.current_pincode.trim())) {
            e.current_pincode = "Must be a 6-digit pincode";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            // Always send all fields so address is never silently dropped
            const payload: any = {
                store_name: form.store_name.trim(),
                retailer_name: form.retailer_name.trim(),
                mobile_number: form.mobile_number.trim(),
                current_address: form.current_address.trim(),
                current_pincode: form.current_pincode.trim(),
            };

            const res = await updateWorkshop(workshop.retailerId, payload);


            // Backend may return HTTP 200 but with a non-success code in body
            // e.g. { code: 400, message: "Pincode X not found or inactive" }
            const body = res?.data;
            if (body?.code && body.code !== 200) {
                const msg: string = body.message || "Failed to update workshop";
                // Show inline on relevant field too
                if (/pincode/i.test(msg)) setErrors(prev => ({ ...prev, current_pincode: msg }));
                else if (/mobile/i.test(msg)) setErrors(prev => ({ ...prev, mobile_number: msg }));
                toast.error(msg);
                return;
            }

            toast.success("Workshop updated successfully");
            onSuccess(body?.data || { ...workshop, ...payload });
        } catch (err: any) {
            const msg: string = err?.response?.data?.message || "Failed to update workshop";
            if (/pincode/i.test(msg)) setErrors(prev => ({ ...prev, current_pincode: msg }));
            else if (/mobile/i.test(msg)) setErrors(prev => ({ ...prev, mobile_number: msg }));
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const inputCls = (field: string) =>
        `w-full border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2 ${errors[field]
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
        }`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <EditIcon className="text-white" fontSize="small" />
                        <h2 className="text-white font-bold text-lg">Edit Workshop</h2>
                        <span className="ml-2 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-mono">
                            #{workshop.retailerId}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-indigo-200 transition">
                        <CloseIcon />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Workshop Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Workshop Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls("store_name")}
                            value={form.store_name}
                            onChange={e => setForm(f => ({ ...f, store_name: e.target.value }))}
                            placeholder="Enter workshop name"
                        />
                        {errors.store_name && <p className="text-red-500 text-xs mt-1">{errors.store_name}</p>}
                    </div>

                    {/* Owner Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Owner Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls("retailer_name")}
                            value={form.retailer_name}
                            onChange={e => setForm(f => ({ ...f, retailer_name: e.target.value }))}
                            placeholder="Enter owner name"
                        />
                        {errors.retailer_name && <p className="text-red-500 text-xs mt-1">{errors.retailer_name}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls("mobile_number")}
                            value={form.mobile_number}
                            onChange={e => setForm(f => ({ ...f, mobile_number: e.target.value }))}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            inputMode="numeric"
                        />
                        {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Address
                        </label>
                        <textarea
                            className={`${inputCls("current_address")} resize-none`}
                            value={form.current_address}
                            onChange={e => setForm(f => ({ ...f, current_address: e.target.value }))}
                            placeholder="Enter workshop address"
                            rows={2}
                        />
                        {errors.current_address && <p className="text-red-500 text-xs mt-1">{errors.current_address}</p>}
                    </div>

                    {/* Pincode */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls("current_pincode")}
                            value={form.current_pincode}
                            onChange={e => {
                                setForm(f => ({ ...f, current_pincode: e.target.value }));
                                // Clear pincode error when user starts editing
                                if (errors.current_pincode) setErrors(prev => ({ ...prev, current_pincode: "" }));
                            }}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            inputMode="numeric"
                        />
                        {errors.current_pincode && <p className="text-red-500 text-xs mt-1">{errors.current_pincode}</p>}
                        <p className="text-xs text-gray-400 mt-1">City, District & State will be auto-updated from pincode</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm disabled:opacity-50"
                    >
                        {saving ? (
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        ) : (
                            <SaveIcon fontSize="small" />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Add Workshop Modal ────────────────────────────────────────────────────────


const AddWorkshopModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
    const initialForm = {
        store_name: "",
        retailer_name: "",
        mobile_number: "",
        current_address: "",
        current_pincode: "",
    };
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const MOBILE_RE = /^[6-9]\d{9}$/;

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.store_name.trim()) e.store_name = "Workshop name is required";
        if (!form.retailer_name.trim()) e.retailer_name = "Owner name is required";
        if (!form.mobile_number.trim()) {
            e.mobile_number = "Mobile number is required";
        } else if (!MOBILE_RE.test(form.mobile_number.trim())) {
            e.mobile_number = "Must be a 10-digit Indian mobile number (starts with 6-9)";
        }
        if (!form.current_address.trim()) e.current_address = "Address is required";
        if (!form.current_pincode.trim()) {
            e.current_pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(form.current_pincode.trim())) {
            e.current_pincode = "Must be a 6-digit pincode";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const res = await bulkCreateWorkshops([{
                store_name: form.store_name.trim(),
                retailer_name: form.retailer_name.trim(),
                mobile_number: form.mobile_number.trim(),
                current_address: form.current_address.trim(),
                current_pincode: form.current_pincode ? Number(form.current_pincode) : undefined,
            }]);
            const body = res?.data;
            // API returns 200 even on failure — check summary
            if (body?.summary?.failed > 0) {
                const reason = body.failed?.[0]?.reason || body.message || "Failed to add workshop";
                toast.error(reason);
                return;
            }
            toast.success("Workshop added successfully");
            setForm(initialForm);
            setErrors({});
            onSuccess();
            onClose();
        } catch (err: any) {
            const body = err?.response?.data;
            const reason = body?.failed?.[0]?.reason || body?.message || "Failed to add workshop";
            toast.error(reason);
        } finally {
            setSaving(false);
        }
    };

    const inputCls = (field: string) =>
        `w-full border rounded-lg px-3 py-2 text-sm outline-none transition focus:ring-2 ${
            errors[field]
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
        }`;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AddCircleOutlineIcon className="text-white" fontSize="small" />
                        <h2 className="text-white font-bold text-lg">Add Workshop</h2>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-green-200 transition">
                        <CloseIcon />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    {/* Workshop Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Workshop Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls("store_name")}
                            value={form.store_name}
                            onChange={e => setForm(f => ({ ...f, store_name: e.target.value }))}
                            placeholder="Enter workshop name"
                        />
                        {errors.store_name && <p className="text-red-500 text-xs mt-1">{errors.store_name}</p>}
                    </div>

                    {/* Owner Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Workshop Owner Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls("retailer_name")}
                            value={form.retailer_name}
                            onChange={e => setForm(f => ({ ...f, retailer_name: e.target.value }))}
                            placeholder="Enter owner name"
                        />
                        {errors.retailer_name && <p className="text-red-500 text-xs mt-1">{errors.retailer_name}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls("mobile_number")}
                            value={form.mobile_number}
                            onChange={e => setForm(f => ({ ...f, mobile_number: e.target.value }))}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            inputMode="numeric"
                        />
                        {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
                    </div>

                    {/* Current Address */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Current Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className={inputCls("current_address") + " resize-none"}
                            value={form.current_address}
                            onChange={e => setForm(f => ({ ...f, current_address: e.target.value }))}
                            placeholder="Enter full address"
                            rows={2}
                        />
                        {errors.current_address && <p className="text-red-500 text-xs mt-1">{errors.current_address}</p>}
                    </div>

                    {/* Current Pincode */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Current Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls("current_pincode")}
                            value={form.current_pincode}
                            onChange={e => setForm(f => ({ ...f, current_pincode: e.target.value }))}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            inputMode="numeric"
                        />
                        {errors.current_pincode && <p className="text-red-500 text-xs mt-1">{errors.current_pincode}</p>}
                        <p className="text-xs text-gray-400 mt-1">City, District &amp; State will be auto-resolved from pincode</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-50"
                    >
                        {saving ? (
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        ) : (
                            <AddCircleOutlineIcon fontSize="small" />
                        )}
                        Add Workshop
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Bulk Upload Modal ──────────────────────────────────────────────────────────

const BulkUploadModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}> = ({ isOpen, onClose, onUploadSuccess }) => {
    const [stage, setStage] = useState<UploadStage>("select");
    const [excelData, setExcelData] = useState<any[]>([]);
    const [fileName, setFileName] = useState("");
    const [processing, setProcessing] = useState(false);
    const [responseData, setResponseData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"success" | "failed">("failed");
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDownloadTemplate = () => {
        // Headers-only sheet — no example data
        const headers = EXCEL_COLUMNS.map((c) => c.label);
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Workshops");
        XLSX.writeFile(wb, "Workshop_Upload_Template.xlsx");
        toast.success("Template downloaded!");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setProcessing(true);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = evt.target?.result;
                const wb = XLSX.read(data, { type: "binary" });
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                if (json.length === 0) {
                    toast.error("Excel file is empty");
                    setProcessing(false);
                    return;
                }

                // Map friendly column labels → API keys (case-insensitive)
                const mapped = json.map((row) => {
                    const newRow: any = {};
                    EXCEL_COLUMNS.forEach(({ label, key }) => {
                        const actualKey = Object.keys(row).find(
                            (k) => k.trim().toLowerCase() === label.toLowerCase()
                        );
                        newRow[key] = actualKey ? row[actualKey] : "";
                    });
                    return newRow;
                });

                // Validate required fields
                const hasRequired = mapped.every((r) => r.store_name && r.retailer_name && r.mobile_number && r.current_address && r.current_pincode);
                if (!hasRequired) {
                    toast.warn("Some rows are missing required fields (Workshop Name, Workshop Owner Name, Mobile Number, Current Address, Current Pincode)");
                }

                setExcelData(mapped);
                setStage("preview");
            } catch (err) {
                console.error(err);
                toast.error("Error reading Excel file");
            } finally {
                setProcessing(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleSubmit = async () => {
        setProcessing(true);
        try {
            const payload = excelData.map((row) => ({
                store_name: String(row.store_name || "").trim(),
                retailer_name: String(row.retailer_name || "").trim(),
                mobile_number: String(row.mobile_number || "").trim(),
                current_address: String(row.current_address || "").trim(),
                current_pincode: row.current_pincode ? Number(row.current_pincode) : undefined,
            }));

            const res = await bulkCreateWorkshops(payload);
            const body = res?.data;
            setResponseData(body);
            setStage("results");

            const summary = body?.summary || {};
            if ((summary.failed ?? 0) === 0) {
                setActiveTab("success");
                toast.success(body?.message || "All workshops created successfully");
                onUploadSuccess();
            } else if ((summary.created ?? 0) === 0) {
                setActiveTab("failed");
                toast.error(body?.message || "All rows failed");
            } else {
                setActiveTab("failed");
                toast.warn(body?.message || `${summary.created} created, ${summary.failed} failed`);
                onUploadSuccess();
            }
        } catch (err: any) {
            const errBody = err.response?.data;
            if (errBody?.summary) {
                setResponseData(errBody);
                setStage("results");
                setActiveTab("failed");
                toast.error(errBody?.message || "Upload completed with errors");
            } else {
                toast.error("Failed to upload workshops");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setStage("select");
        setExcelData([]);
        setFileName("");
        setResponseData(null);
        setActiveTab("failed");
        onClose();
    };

    const summary = responseData?.summary || { total: 0, created: 0, failed: 0 };
    const successRecords: any[] = responseData?.success || [];
    const failedRecords: any[] = responseData?.failed || [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b bg-blue-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <UploadFileIcon className="text-blue-700" />
                        <div>
                            <h2 className="text-xl font-bold text-blue-700">Bulk Upload Workshops</h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {stage === "select" && "Upload an Excel file with workshop data"}
                                {stage === "preview" && `Previewing ${excelData.length} records from "${fileName}"`}
                                {stage === "results" && "Upload Results"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {stage === "select" && (
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg border border-green-200 text-sm font-medium transition"
                            >
                                <DownloadIcon fontSize="small" />
                                Download Template
                            </button>
                        )}
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 transition">
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto p-6">

                    {/* SELECT STAGE */}
                    {stage === "select" && (
                        <div className="flex flex-col items-center justify-center h-full min-h-64">
                            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-14 text-center hover:border-blue-500 bg-blue-50 hover:bg-blue-100 transition w-full max-w-xl">
                                <UploadFileIcon style={{ fontSize: 64 }} className="text-blue-400 mb-4" />
                                <p className="text-gray-700 font-semibold mb-2">Drag & drop or choose a file</p>
                                <label className="cursor-pointer inline-block mt-2">
                                    <span className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                                        Choose Excel File
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="mt-4 text-sm text-gray-400">Supported: .xlsx, .xls</p>
                                <div className="mt-6 border-t pt-4 text-left">
                                    <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Required Columns in Excel</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        {EXCEL_COLUMNS.map((col) => (
                                            <li key={col.key} className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${["store_name", "retailer_name", "mobile_number", "current_address", "current_pincode"].includes(col.key) ? "bg-red-400" : "bg-gray-300"}`} />
                                                <span>{col.label}</span>
                                                {["store_name", "retailer_name", "mobile_number", "current_address", "current_pincode"].includes(col.key) && (
                                                    <span className="text-red-500 text-xs">*</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PREVIEW STAGE */}
                    {stage === "preview" && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                        {EXCEL_COLUMNS.map((col) => (
                                            <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {excelData.slice(0, 100).map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-3 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                                            {EXCEL_COLUMNS.map((col) => (
                                                <td key={col.key} className="px-4 py-2.5 text-gray-700 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                                                    {row[col.key] !== "" && row[col.key] != null ? row[col.key] : <span className="text-gray-300 italic">—</span>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {excelData.length > 100 && (
                                <p className="text-center text-gray-400 mt-4 text-sm italic">
                                    Showing first 100 of {excelData.length} records
                                </p>
                            )}
                        </div>
                    )}

                    {/* RESULTS STAGE */}
                    {stage === "results" && responseData && (
                        <div className="flex flex-col h-full">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                    <p className="text-xs text-blue-500 font-semibold uppercase">Total Processed</p>
                                    <p className="text-3xl font-bold text-blue-700 mt-1">{summary.total}</p>
                                </div>
                                <div
                                    className={`p-4 rounded-xl border cursor-pointer transition ${activeTab === "success" ? "bg-green-100 border-green-300 ring-2 ring-green-400" : "bg-green-50 border-green-100 hover:bg-green-100"}`}
                                    onClick={() => setActiveTab("success")}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-green-600 font-semibold uppercase">Created</p>
                                            <p className="text-3xl font-bold text-green-700 mt-1">{summary.created}</p>
                                        </div>
                                        <CheckCircleOutlineIcon className="text-green-400" style={{ fontSize: 36 }} />
                                    </div>
                                </div>
                                <div
                                    className={`p-4 rounded-xl border cursor-pointer transition ${activeTab === "failed" ? "bg-red-100 border-red-300 ring-2 ring-red-400" : "bg-red-50 border-red-100 hover:bg-red-100"}`}
                                    onClick={() => setActiveTab("failed")}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-red-600 font-semibold uppercase">Failed</p>
                                            <p className="text-3xl font-bold text-red-700 mt-1">{summary.failed}</p>
                                        </div>
                                        <ErrorOutlineIcon className="text-red-400" style={{ fontSize: 36 }} />
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b mb-4">
                                <button
                                    className={`px-6 py-2 text-sm font-semibold transition-colors ${activeTab === "failed" ? "border-b-2 border-red-500 text-red-600" : "text-gray-400 hover:text-gray-600"}`}
                                    onClick={() => setActiveTab("failed")}
                                >
                                    Failed ({summary.failed})
                                </button>
                                <button
                                    className={`px-6 py-2 text-sm font-semibold transition-colors ${activeTab === "success" ? "border-b-2 border-green-500 text-green-600" : "text-gray-400 hover:text-gray-600"}`}
                                    onClick={() => setActiveTab("success")}
                                >
                                    Successful ({summary.created})
                                </button>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-auto">
                                {activeTab === "success" && (
                                    successRecords.length > 0 ? (
                                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden text-sm">
                                            <thead className="bg-green-50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Workshop Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mobile Number</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Retailer ID</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {successRecords.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-green-50">
                                                        <td className="px-4 py-2.5 text-gray-800 font-medium">{item.storeName || "—"}</td>
                                                        <td className="px-4 py-2.5 text-gray-600">{item.mobileNumber || "—"}</td>
                                                        <td className="px-4 py-2.5 text-green-700 font-semibold">{item.retailerId || "—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">No successful records</div>
                                    )
                                )}

                                {activeTab === "failed" && (
                                    failedRecords.length > 0 ? (
                                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden text-sm">
                                            <thead className="bg-red-50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Row</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Workshop Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mobile Number</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase max-w-xs">Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {failedRecords.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-red-50">
                                                        <td className="px-4 py-2.5 text-gray-500">{item.row}</td>
                                                        <td className="px-4 py-2.5 text-gray-800 font-medium">{item.storeName}</td>
                                                        <td className="px-4 py-2.5 text-gray-600">{item.mobileNumber}</td>
                                                        <td className="px-4 py-2.5 text-red-600 font-medium whitespace-normal max-w-xs">{item.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">No failed records 🎉</div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    <div>
                        {stage === "preview" && (
                            <button
                                onClick={() => { setStage("select"); setExcelData([]); setFileName(""); }}
                                className="flex items-center gap-1.5 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
                            >
                                <ArrowBackIcon fontSize="small" /> Choose Different File
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
                        >
                            {stage === "results" ? "Close" : "Cancel"}
                        </button>
                        {stage === "preview" && (
                            <button
                                onClick={handleSubmit}
                                disabled={processing || excelData.length === 0}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50"
                            >
                                {processing && (
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                )}
                                Submit {excelData.length} Records
                            </button>
                        )}
                        {stage === "results" && (
                            <button
                                onClick={() => { setStage("preview"); setResponseData(null); }}
                                className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium text-sm"
                            >
                                Back to Preview
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────────

const ManageWorkshop: React.FC = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null);
    const pageSize = 10;

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const fetchWorkshops = async (currentPage: number, searchVal: string) => {
        setLoading(true);
        try {
            const res = await getWorkshops({ page: currentPage, limit: pageSize, search: searchVal });
            const body = res?.data;
            // Backend returns: { data: [...], pagination: { total, ... } }
            if (body) {
                setWorkshops(body.data || []);
                setTotalRows(body.pagination?.total || 0);
            }
        } catch (err) {
            console.error("Error fetching workshops:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        fetchWorkshops(page, debouncedSearch);
    }, [page, debouncedSearch]);

    const totalPages = Math.ceil(totalRows / pageSize);

    // Optimistic update: patch the workshop in the local list without a full refetch
    const handleEditSuccess = (updated: Workshop) => {
        setWorkshops(prev =>
            prev.map(w => w.retailerId === updated.retailerId ? { ...w, ...updated } : w)
        );
        setEditWorkshop(null);
    };

    return (
        <div className="bg-white rounded-xl shadow p-5 border border-gray-200 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <StorefrontIcon className="text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-800">Manage Workshops</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">View and manage all registered workshops</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAddOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition font-semibold text-sm shadow"
                    >
                        <AddCircleOutlineIcon fontSize="small" />
                        Add Workshop
                    </button>
                    <button
                        onClick={() => setUploadOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition font-semibold text-sm shadow"
                    >
                        <UploadFileIcon fontSize="small" />
                        Bulk Upload
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-5 max-w-sm">
                <SearchIcon className="text-gray-400" fontSize="small" />
                <input
                    type="text"
                    placeholder="Search by store or owner name..."
                    className="bg-transparent outline-none text-sm text-gray-700 w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon fontSize="small" />
                    </button>
                )}
            </div>

            {/* Stats Bar */}
            <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
                <span>Total: <strong className="text-gray-800">{totalRows}</strong> workshops</span>
                {debouncedSearch && <span className="text-blue-600">· Filtered by "{debouncedSearch}"</span>}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Workshop Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mobile</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pincode</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">State</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created At</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="py-16 text-center">
                                    <svg className="animate-spin h-7 w-7 text-blue-500 mx-auto" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    <p className="mt-2 text-gray-400 text-sm">Loading workshops...</p>
                                </td>
                            </tr>
                        ) : workshops.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-16 text-center text-gray-400">
                                    <StorefrontIcon style={{ fontSize: 48 }} className="text-gray-200 mb-2" />
                                    <p>No workshops found</p>
                                    {debouncedSearch && <p className="text-xs mt-1">Try a different search term</p>}
                                </td>
                            </tr>
                        ) : (
                            workshops.map((w, idx) => (
                                <tr key={w.retailerId} className="hover:bg-blue-50 transition-colors group">
                                    <td className="px-4 py-3 text-gray-400">{(page - 1) * pageSize + idx + 1}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{w.storeName}</td>
                                    <td className="px-4 py-3 text-gray-700">{w.retailerName}</td>
                                    <td className="px-4 py-3 text-gray-600 font-mono">{w.mobileNumber}</td>
                                    <td className="px-4 py-3 text-gray-600">{w.currentPincode}</td>
                                    <td className="px-4 py-3 text-gray-600">{w.cityName || "—"}</td>
                                    <td className="px-4 py-3 text-gray-600">{w.stateName || "—"}</td>
                                    <td className="px-4 py-3 text-gray-600">{w.currentAddress || "—"}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{w.createdAt ? new Date(w.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1 group-hover:opacity-100 transition">
                                            {/* View */}
                                            <button
                                                onClick={() => setSelectedId(w.retailerId)}
                                                className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 transition"
                                                title="View Details"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </button>
                                            {/* Edit */}
                                            <button
                                                onClick={() => setEditWorkshop(w)}
                                                className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-100 transition"
                                                title="Edit Workshop"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                    <p className="text-gray-500">
                        Page {page} of {totalPages} &nbsp;·&nbsp; {totalRows} total workshops
                    </p>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ‹ Prev
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                            const pg = start + i;
                            return (
                                <button
                                    key={pg}
                                    onClick={() => setPage(pg)}
                                    className={`px-3 py-1.5 border rounded-lg transition ${pg === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}
                                >
                                    {pg}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next ›
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <AddWorkshopModal
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={() => fetchWorkshops(1, debouncedSearch)}
            />
            <BulkUploadModal
                isOpen={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onUploadSuccess={() => fetchWorkshops(1, debouncedSearch)}
            />
            {selectedId !== null && (
                <WorkshopDetailModal
                    workshopId={selectedId}
                    onClose={() => setSelectedId(null)}
                />
            )}
            {editWorkshop !== null && (
                <EditWorkshopModal
                    workshop={editWorkshop}
                    onClose={() => setEditWorkshop(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default ManageWorkshop;
