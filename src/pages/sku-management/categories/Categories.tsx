import React, { useState, useEffect, useRef } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import TopBar from "../../../layouts/top-bar";
import { getCategories, userLogout, editCategory, addCategory, checkCategoryShortCode } from "../../../services/ApiService";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HistoryIcon from "@mui/icons-material/History";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../redux/slices/userDataSlice";
import { clearTokens } from "../../../redux/slices/authTokenSlice";
import CategoryBulkUpload from "./CategoryBulkUpload";
import ExportButton from "../../../components/ExportButton";
import { getCategoryHistory } from "../../../services/ApiService";

const EMPTY_ADD_FORM = { categoryName: "", categoryShortCode: "", categoryDescription: "" };

const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const pageSize = 10;

    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [editForm, setEditForm] = useState({ name: "", description: "", isActive: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState(EMPTY_ADD_FORM);
    const [isAddSubmitting, setIsAddSubmitting] = useState(false);
    // Short code availability: null = unchecked, true = available, false = taken
    const [shortCodeStatus, setShortCodeStatus] = useState<null | boolean>(null);
    const [isCheckingShortCode, setIsCheckingShortCode] = useState(false);
    const shortCodeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Bulk Upload state
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

    // History state
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyTotalRows, setHistoryTotalRows] = useState(0);
    const [selectedCategoryForHistory, setSelectedCategoryForHistory] = useState<any>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    const fetchCategories = async (currentPage: number = 1) => {
        setLoading(true);
        try {
            const res = await getCategories(currentPage, pageSize);
            setCategories(res?.data?.data || []);
            setTotalRows(res?.data?.pagination?.total ?? res?.data?.data?.length ?? 0);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await userLogout();
        } catch (err) {
            console.error("Logout API failed:", err);
        }
        dispatch(logoutUser());
        dispatch(clearTokens());
        navigate("/");
    };

    const exportCategories = async () => {
        try {
            const res = await getCategories(1, 10000);
            return res?.data?.data || [];
        } catch (error) {
            console.error("Error exporting categories:", error);
            toast.error("Failed to export categories");
            return [];
        }
    };

    // ── Edit handlers ─────────────────────────────────────────────────────────
    const handleEditClick = (category: any) => {
        setEditingCategory(category);
        setEditForm({
            name: category.name || category.categoryName || category.title || "",
            description: category.categoryDescription || category.description || "",
            isActive: category.isActive !== undefined ? category.isActive : (category.status === 'active' || true)
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingCategory(null);
        setEditForm({ name: "", description: "", isActive: true });
    };

    const handleEditSubmit = async () => {
        if (!editingCategory) return;
        setIsSubmitting(true);
        try {
            const categoryId = editingCategory.id || editingCategory.categoryId || editingCategory._id;
            const payload = {
                categoryName: editForm.name,
                categoryDescription: editForm.description,
                isActive: editForm.isActive
            };
            await editCategory(categoryId, payload);
            toast.success("Category updated successfully");
            handleCloseEditModal();
            fetchCategories(page);
        } catch (error: any) {
            console.error("Error updating category:", error);
            toast.error(error?.response?.data?.message || "Failed to update category");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Add handlers ──────────────────────────────────────────────────────────
    const handleOpenAddModal = () => {
        setAddForm(EMPTY_ADD_FORM);
        setShortCodeStatus(null);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setAddForm(EMPTY_ADD_FORM);
        setShortCodeStatus(null);
        if (shortCodeDebounceRef.current) clearTimeout(shortCodeDebounceRef.current);
    };

    const handleShortCodeChange = (value: string) => {
        // Enforce max 2 chars, uppercase
        const cleaned = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
        setAddForm(prev => ({ ...prev, categoryShortCode: cleaned }));
        setShortCodeStatus(null);

        if (shortCodeDebounceRef.current) clearTimeout(shortCodeDebounceRef.current);

        if (cleaned.length === 2) {
            shortCodeDebounceRef.current = setTimeout(async () => {
                setIsCheckingShortCode(true);
                try {
                    const res = await checkCategoryShortCode(cleaned);
                    // 200 response: available = true
                    const available = res?.data?.data?.available ?? res?.data?.available ?? true;
                    setShortCodeStatus(available);
                } catch (err: any) {
                    // 409 response means short code is taken
                    const available = err?.response?.data?.data?.available;
                    if (available === false || err?.response?.status === 409) {
                        setShortCodeStatus(false);
                    } else {
                        setShortCodeStatus(null);
                    }
                } finally {
                    setIsCheckingShortCode(false);
                }
            }, 500);
        }
    };

    const handleAddSubmit = async () => {
        const { categoryName, categoryShortCode, categoryDescription } = addForm;
        if (!categoryName || !categoryShortCode || !categoryDescription) {
            toast.error("All fields are required");
            return;
        }
        if (categoryShortCode.length !== 2) {
            toast.error("Short code must be exactly 2 characters");
            return;
        }
        if (shortCodeStatus === false) {
            toast.error("Short code is already taken. Please choose another.");
            return;
        }
        setIsAddSubmitting(true);
        try {
            await addCategory({ categoryName, categoryShortCode, categoryDescription });
            toast.success("Category added successfully");
            handleCloseAddModal();
            fetchCategories(page);
        } catch (error: any) {
            console.error("Error adding category:", error);
            toast.error(error?.response?.data?.message || "Failed to add category");
        } finally {
            setIsAddSubmitting(false);
        }
    };

    // ── History helpers ───────────────────────────────────────────────────────
    const handleOpenHistoryModal = (category: any) => {
        setSelectedCategoryForHistory(category);
        setHistoryPage(1);
        setIsHistoryModalOpen(true);
        fetchHistory(category.id || category.categoryId || category._id, 1);
    };

    const handleCloseHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedCategoryForHistory(null);
        setHistoryData([]);
    };

    const fetchHistory = async (categoryId: number, currentPage: number = 1) => {
        setHistoryLoading(true);
        try {
            const res = await getCategoryHistory(categoryId, currentPage, 10);
            setHistoryData(res?.data?.data || []);
            setHistoryTotalRows(res?.data?.pagination?.total ?? res?.data?.data?.length ?? 0);
        } catch (error) {
            console.error("Error fetching category history:", error);
            toast.error("Failed to load category history");
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (isHistoryModalOpen && selectedCategoryForHistory) {
            fetchHistory(selectedCategoryForHistory.id || selectedCategoryForHistory.categoryId || selectedCategoryForHistory._id, historyPage);
        }
    }, [historyPage]);

    const columns: Column[] = [
        {
            key: "id",
            label: "ID",
            render: (row: any) => row.id || row.categoryId || row._id || "N/A"
        },
        {
            key: "name",
            label: "Category Name",
            render: (row: any) => row.name || row.categoryName || row.title || "N/A"
        },
        {
            key: "shortCode",
            label: "Short Code",
            render: (row: any) => row.categoryShortCode || row.shortCode || "N/A"
        },
        {
            key: "description",
            label: "Description",
            render: (row: any) => row.categoryDescription || row.description || "N/A"
        },
        {
            key: "status",
            label: "Status",
            render: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive || row.status === 'active' || row.isActive === undefined ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {row.isActive !== undefined ? (row.isActive ? 'Active' : 'Inactive') : (row.status || 'Active')}
                </span>
            )
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
                        <EditIcon fontSize="small"  />
                    </button>
                    <button
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                        onClick={() => handleOpenHistoryModal(row)}
                        title="View History"
                    >
                        <HistoryIcon fontSize="small" />
                    </button>
                    <button
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        onClick={() => navigate(`/categories/${row.id || row.categoryId || row._id}/subcategories`)}
                        title="View Sub Categories"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="Categories Management"
                description="Manage SKU product categories"
                actionButton={
                    <div className="flex items-center gap-3">
                        <ExportButton exporter={exportCategories} reportName="Categories List" />
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
                            <AddBoxIcon fontSize="small" />
                            Add Category
                        </button>
                    </div>
                }
                logout={logout}
            />

            <div className="mt-6 px-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="text-gray-600">Loading categories...</div>
                        </div>
                    ) : (
                        <CustomTable
                            columns={columns}
                            data={categories}
                            pageSize={pageSize}
                            totalRows={totalRows}
                            currentPage={page}
                            onPageChange={(p) => setPage(p)}
                        />
                    )}
                </div>
            </div>

            {/* ── Edit Modal ─────────────────────────────────────────────────── */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Edit Category</h3>
                            <button
                                type="button"
                                onClick={handleCloseEditModal}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Close edit modal"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter category name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter category description"
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
                                <button onClick={handleCloseEditModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors" disabled={isSubmitting}>
                                    Cancel
                                </button>
                                <button onClick={handleEditSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Category Modal ─────────────────────────────────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Add New Category</h3>
                            <button
                                type="button"
                                onClick={handleCloseAddModal}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Close add modal"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={addForm.categoryName}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, categoryName: e.target.value }))}
                                    placeholder="e.g. ENGINE PARTS"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Short Code <span className="text-red-500">*</span>
                                    <span className="ml-1 text-xs text-gray-400 font-normal">(exactly 2 letters, A–Z)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength={2}
                                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase tracking-widest font-mono
                                            ${shortCodeStatus === true ? "border-green-400" : shortCodeStatus === false ? "border-red-400" : "border-gray-300"}`}
                                        value={addForm.categoryShortCode}
                                        onChange={(e) => handleShortCodeChange(e.target.value)}
                                        placeholder="e.g. EP"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isCheckingShortCode && (
                                            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                        )}
                                        {!isCheckingShortCode && shortCodeStatus === true && <CheckCircleIcon fontSize="small" className="text-green-500" />}
                                        {!isCheckingShortCode && shortCodeStatus === false && <CancelIcon fontSize="small" className="text-red-500" />}
                                    </div>
                                </div>
                                {shortCodeStatus === true && <p className="mt-1 text-xs text-green-600">Short code is available ✓</p>}
                                {shortCodeStatus === false && <p className="mt-1 text-xs text-red-600">Short code is already taken</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                    value={addForm.categoryDescription}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, categoryDescription: e.target.value }))}
                                    placeholder="Enter category description"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={handleCloseAddModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors" disabled={isAddSubmitting}>
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSubmit}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                    disabled={isAddSubmitting || shortCodeStatus === false || isCheckingShortCode}
                                >
                                    {isAddSubmitting ? "Adding..." : "Add Category"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Category History Modal ────────────────────────────────────────────── */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Category History</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedCategoryForHistory?.categoryName || selectedCategoryForHistory?.name} ({selectedCategoryForHistory?.categoryShortCode || selectedCategoryForHistory?.shortCode})
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
                                <div className="text-center py-8 text-gray-500">No history records found for this Category.</div>
                            ) : (
                                <div className="space-y-6">
                                    {historyData.map((item, idx) => (
                                        <div key={item.historyId || idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
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

            <CategoryBulkUpload
                isOpen={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                onUpload={() => fetchCategories(page)}
            />
        </div>
    );
};

export default Categories;
