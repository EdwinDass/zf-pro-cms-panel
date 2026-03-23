import React, { useState, useEffect } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import TopBar from "../../../layouts/top-bar";
import { getSkusBySubcategory, userLogout, editSku, addSku, getSkuHistory } from "../../../services/ApiService";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { logoutUser } from "../../../redux/slices/userDataSlice";
import { clearTokens } from "../../../redux/slices/authTokenSlice";
import SkuBulkUpload from "./SkuBulkUpload";

const EMPTY_ADD_FORM = {
    skuName: "",
    skuCode: "",
    skuDescription: "",
    productValue: "",
    points: "",
};

const Skus = () => {
    const { subcategoryId } = useParams();
    const location = useLocation();
    const categoryId: number = location.state?.categoryId ?? 0;

    const [skus, setSkus] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const pageSize = 10;

    // Edit SKU state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSku, setEditingSku] = useState<any>(null);
    const [editForm, setEditForm] = useState({ skuName: "", skuDescription: "", isActive: true, points: "" });
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);

    // Add SKU state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState(EMPTY_ADD_FORM);
    const [isAddSubmitting, setIsAddSubmitting] = useState(false);

    // Bulk Upload state
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

    // History state
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyTotalRows, setHistoryTotalRows] = useState(0);
    const [selectedSkuForHistory, setSelectedSkuForHistory] = useState<any>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (subcategoryId) fetchSkus(subcategoryId, page);
    }, [subcategoryId, page]);

    const fetchSkus = async (subCatId: string, currentPage: number = 1) => {
        setLoading(true);
        try {
            const res = await getSkusBySubcategory(Number(subCatId), currentPage, pageSize);
            setSkus(res?.data?.data || []);
            setTotalRows(res?.data?.pagination?.total ?? res?.data?.data?.length ?? 0);
        } catch (error) {
            console.error("Error fetching SKUs:", error);
            toast.error("Failed to load SKUs");
        } finally {
            setLoading(false);
        }
    };

    // ── Edit helpers ──────────────────────────────────────────────────────────
    const handleEditClick = (sku: any) => {
        setEditingSku(sku);
        setEditForm({
            skuName: sku.skuName || sku.name || sku.title || "",
            skuDescription: sku.skuDescription || sku.description || "",
            isActive: sku.isActive !== undefined ? sku.isActive : true,
            points: sku.points !== undefined && sku.points !== null ? String(sku.points) : "",
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingSku(null);
        setEditForm({ skuName: "", skuDescription: "", isActive: true, points: "" });
    };

    const handleEditSubmit = async () => {
        if (!editingSku) return;
        setIsEditSubmitting(true);
        try {
            const skuId = editingSku.id || editingSku.skuId || editingSku._id;
            await editSku(skuId, {
                skuName: editForm.skuName,
                skuDescription: editForm.skuDescription,
                isActive: editForm.isActive,
                ...(editForm.points !== "" && { points: editForm.points }),
            });
            toast.success("SKU updated successfully");
            handleCloseEditModal();
            if (subcategoryId) fetchSkus(subcategoryId, page);
        } catch (error: any) {
            console.error("Error updating SKU:", error);
            toast.error(error?.response?.data?.message || "Failed to update SKU");
        } finally {
            setIsEditSubmitting(false);
        }
    };

    // ── Add helpers ───────────────────────────────────────────────────────────
    const handleOpenAddModal = () => {
        setAddForm(EMPTY_ADD_FORM);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setAddForm(EMPTY_ADD_FORM);
    };

    const handleAddSubmit = async () => {
        const { skuName, skuCode, skuDescription, productValue, points } = addForm;
        if (!skuName || !skuCode || !skuDescription || !productValue || !points) {
            toast.error("All fields are required");
            return;
        }
        setIsAddSubmitting(true);
        try {
            await addSku([{
                skuName,
                skuCode,
                skuDescription,
                productValue,
                points,
                categoryId,
                subCategoryId: Number(subcategoryId),
            }]);
            toast.success("SKU added successfully");
            handleCloseAddModal();
            if (subcategoryId) fetchSkus(subcategoryId, page);
        } catch (error: any) {
            console.error("Error adding SKU:", error);
            toast.error(error?.response?.data?.message || "Failed to add SKU");
        } finally {
            setIsAddSubmitting(false);
        }
    };

    // ── History helpers ───────────────────────────────────────────────────────
    const handleOpenHistoryModal = (sku: any) => {
        setSelectedSkuForHistory(sku);
        setHistoryPage(1);
        setIsHistoryModalOpen(true);
        fetchHistory(sku.id || sku.skuId || sku._id, 1);
    };

    const handleCloseHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedSkuForHistory(null);
        setHistoryData([]);
    };

    const fetchHistory = async (skuId: number, currentPage: number = 1) => {
        setHistoryLoading(true);
        try {
            const res = await getSkuHistory(skuId, currentPage, 10);
            setHistoryData(res?.data?.data || []);
            setHistoryTotalRows(res?.data?.pagination?.total ?? res?.data?.data?.length ?? 0);
        } catch (error) {
            console.error("Error fetching SKU history:", error);
            toast.error("Failed to load SKU history");
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (isHistoryModalOpen && selectedSkuForHistory) {
            fetchHistory(selectedSkuForHistory.id || selectedSkuForHistory.skuId || selectedSkuForHistory._id, historyPage);
        }
    }, [historyPage]);

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = async () => {
        try { await userLogout(); } catch (err) { console.error("Logout API failed:", err); }
        dispatch(logoutUser());
        dispatch(clearTokens());
        navigate("/");
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: Column[] = [
        {
            key: "id",
            label: "ID",
            render: (row: any) => row.id || row.skuId || row._id || "N/A",
        },
        {
            key: "skuCode",
            label: "SKU Code",
            render: (row: any) => row.skuCode || row.code || "N/A",
        },
        {
            key: "name",
            label: "SKU Name",
            render: (row: any) => row.skuName || row.name || row.title || "N/A",
        },
        {
            key: "description",
            label: "Description",
            render: (row: any) => row.skuDescription || row.description || "N/A",
        },
        {
            key: "points",
            label: "Points",
            render: (row: any) => row.points !== undefined ? row.points : "N/A",
        },
        {
            key: "status",
            label: "Status",
            render: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive || row.status === "active" || row.isActive === undefined ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {row.isActive !== undefined ? (row.isActive ? "Active" : "Inactive") : (row.status || "Active")}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (row: any) => (
                <div className="flex items-center space-x-4">
                    <button
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        onClick={() => handleEditClick(row)}
                        title="Edit"
                    >
                        <EditIcon fontSize="small" />
                    </button>
                    <button
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                        onClick={() => handleOpenHistoryModal(row)}
                        title="View History"
                    >
                        <HistoryIcon fontSize="small" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="SKUs"
                description={`Viewing SKUs for subcategory ${subcategoryId}`}
                actionButton={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsBulkUploadOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Bulk Upload
                        </button>
                        <button
                            onClick={handleOpenAddModal}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <AddIcon fontSize="small" />
                            Add New SKU
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                            <ArrowBackIcon fontSize="small" />
                            Back
                        </button>
                    </div>
                }
                logout={logout}
            />

            <div className="mt-6 px-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="text-gray-600">Loading SKUs...</div>
                        </div>
                    ) : (
                        <CustomTable
                            columns={columns}
                            data={skus}
                            pageSize={pageSize}
                            totalRows={totalRows}
                            currentPage={page}
                            onPageChange={(p) => setPage(p)}
                        />
                    )}
                </div>
            </div>

            {/* ── Edit SKU Modal ─────────────────────────────────────────────── */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Edit SKU</h3>
                            <button type="button" onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600" aria-label="Close edit modal">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SKU Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editForm.skuName}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, skuName: e.target.value }))}
                                    placeholder="Enter SKU name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                    value={editForm.skuDescription}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, skuDescription: e.target.value }))}
                                    placeholder="Enter SKU description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editForm.points}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setEditForm(prev => ({ ...prev, points: v === '' ? '' : String(Math.floor(Number(v))) }));
                                    }}
                                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault(); }}
                                    placeholder="e.g. 30"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        checked={editForm.isActive}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Is Active</span>
                                </label>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={handleCloseEditModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors" disabled={isEditSubmitting}>Cancel</button>
                                <button onClick={handleEditSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400" disabled={isEditSubmitting}>
                                    {isEditSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add SKU Modal ──────────────────────────────────────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Add New SKU</h3>
                            <button type="button" onClick={handleCloseAddModal} className="text-gray-400 hover:text-gray-600" aria-label="Close add modal">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SKU Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={addForm.skuName}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, skuName: e.target.value }))}
                                    placeholder="e.g. STRUT-FRONT-RH"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SKU Code <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={addForm.skuCode}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, skuCode: e.target.value }))}
                                    placeholder="e.g. TSKU01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                                    value={addForm.skuDescription}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, skuDescription: e.target.value }))}
                                    placeholder="Enter description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Value <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={addForm.productValue}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, productValue: e.target.value }))}
                                    placeholder="e.g. 299.99"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Points <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={addForm.points}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setAddForm(prev => ({ ...prev, points: v === '' ? '' : String(Math.floor(Number(v))) }));
                                    }}
                                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault(); }}
                                    placeholder="e.g. 30"
                                />
                            </div>
                            {/* Read-only context fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category ID</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                        value={categoryId || "—"}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory ID</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                        value={subcategoryId || "—"}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={handleCloseAddModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors" disabled={isAddSubmitting}>Cancel</button>
                                <button onClick={handleAddSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400" disabled={isAddSubmitting}>
                                    {isAddSubmitting ? "Adding..." : "Add SKU"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SKU History Modal ────────────────────────────────────────────── */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">SKU History</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedSkuForHistory?.skuName || selectedSkuForHistory?.name} ({selectedSkuForHistory?.skuCode || selectedSkuForHistory?.code})
                                </p>
                            </div>
                            <button type="button" onClick={handleCloseHistoryModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {historyLoading && historyData.length === 0 ? (
                                <div className="flex justify-center py-8 text-gray-500">Loading history...</div>
                            ) : historyData.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">No history records found for this SKU.</div>
                            ) : (
                                <div className="space-y-6">
                                    {historyData.map((item, idx) => (
                                        <div key={item.historyId || idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex flex-col gap-1">
                                                <div className="flex justify-between items-center flex-wrap gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-1 text-xs font-bold rounded ${item.action === 'CREATE' ? 'bg-green-100 text-green-700' : item.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                            {item.action}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            Modified By: <strong>{item.modifiedBy || 'System'}</strong>
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                {item.remarks && (
                                                    <div className="mt-1 pt-2 border-t border-gray-200 flex items-start gap-2">
                                                        <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded whitespace-nowrap">Remarks</span>
                                                        <span className="text-xs text-gray-700">{item.remarks}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {item.action !== 'CREATE' && (
                                                    <div className="bg-red-50 p-3 rounded border border-red-100 overflow-x-auto">
                                                        <h4 className="text-xs font-semibold text-red-800 mb-2 uppercase tracking-wide">Previous Data</h4>
                                                        <pre className="text-xs text-red-900 whitespace-pre-wrap font-mono">
                                                            {JSON.stringify(item.previousData, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                                {item.action !== 'DELETE' && (
                                                    <div className={`${item.action === 'CREATE' ? 'col-span-1 md:col-span-2' : ''} bg-green-50 p-3 rounded border border-green-100 overflow-x-auto`}>
                                                        <h4 className="text-xs font-semibold text-green-800 mb-2 uppercase tracking-wide">New Data</h4>
                                                        <pre className="text-xs text-green-900 whitespace-pre-wrap font-mono">
                                                            {JSON.stringify(item.newData, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
                            <span className="text-sm text-gray-600">
                                Showing {((historyPage - 1) * 10) + 1} to {Math.min(historyPage * 10, historyTotalRows)} of {historyTotalRows} records
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                                    disabled={historyPage === 1 || historyLoading}
                                    className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setHistoryPage(p => p + 1)}
                                    disabled={historyPage * 10 >= historyTotalRows || historyLoading}
                                    className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SkuBulkUpload
                isOpen={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                onUpload={() => {
                    if (subcategoryId) fetchSkus(subcategoryId, page);
                }}
            />
        </div>
    );
};

export default Skus;
