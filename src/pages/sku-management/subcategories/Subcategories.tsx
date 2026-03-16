import React, { useState, useEffect } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import TopBar from "../../../layouts/top-bar";
import { getSubcategoriesByCategory, getAllSubcategories, userLogout, editSubcategory, addSubcategory } from "../../../services/ApiService";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { logoutUser } from "../../../redux/slices/userDataSlice";
import { clearTokens } from "../../../redux/slices/authTokenSlice";
import SubCategoryBulkUpload from "./SubCategoryBulkUpload";
import ExportButton from "../../../components/ExportButton";
import { getSubCategoryHistory } from "../../../services/ApiService";

const EMPTY_ADD_FORM = { subCategoryName: "", subCategoryDescription: "" };

const SubCategories = () => {
    const { categoryId } = useParams();
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const pageSize = 10;

    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
    const [editForm, setEditForm] = useState({ name: "", description: "", isActive: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add state
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
    const [selectedSubcategoryForHistory, setSelectedSubcategoryForHistory] = useState<any>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (categoryId) {
            fetchSubCategories(categoryId, page);
        }
    }, [categoryId, page]);

    const fetchSubCategories = async (catId: string, currentPage: number = 1) => {
        setLoading(true);
        try {
            const res = await getSubcategoriesByCategory(Number(catId), currentPage, pageSize);
            setSubCategories(res?.data?.data || []);
            setTotalRows(res?.data?.pagination?.total ?? res?.data?.data?.length ?? 0);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            toast.error("Failed to load subcategories");
        } finally {
            setLoading(false);
        }
    };

    const exportSubcategories = async () => {
        try {
            const res = await getAllSubcategories(1, 10000);
            return res?.data?.data || [];
        } catch (error) {
            console.error("Error exporting subcategories:", error);
            toast.error("Failed to export subcategories");
            return [];
        }
    };

    // ── Edit handlers ─────────────────────────────────────────────────────────
    const handleEditClick = (subcategory: any) => {
        setEditingSubcategory(subcategory);
        setEditForm({
            name: subcategory.name || subcategory.subCategoryName || subcategory.title || "",
            description: subcategory.subCategoryDescription || subcategory.description || "",
            isActive: subcategory.isActive !== undefined ? subcategory.isActive : (subcategory.status === 'active' || true)
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingSubcategory(null);
        setEditForm({ name: "", description: "", isActive: true });
    };

    const handleEditSubmit = async () => {
        if (!editingSubcategory) return;
        setIsSubmitting(true);
        try {
            const subcategoryId = editingSubcategory.id || editingSubcategory.subCategoryId || editingSubcategory._id;
            const payload = {
                subCategoryName: editForm.name,
                subCategoryDescription: editForm.description,
                isActive: editForm.isActive
            };
            await editSubcategory(subcategoryId, payload);
            toast.success("Subcategory updated successfully");
            handleCloseEditModal();
            if (categoryId) fetchSubCategories(categoryId, page);
        } catch (error: any) {
            console.error("Error updating subcategory:", error);
            toast.error(error?.response?.data?.message || "Failed to update subcategory");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Add handlers ──────────────────────────────────────────────────────────
    const handleOpenAddModal = () => {
        setAddForm(EMPTY_ADD_FORM);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setAddForm(EMPTY_ADD_FORM);
    };

    const handleAddSubmit = async () => {
        const { subCategoryName, subCategoryDescription } = addForm;
        if (!subCategoryName || !subCategoryDescription) {
            toast.error("All fields are required");
            return;
        }
        setIsAddSubmitting(true);
        try {
            await addSubcategory({
                categoryId: Number(categoryId),
                subCategoryName,
                subCategoryDescription,
            });
            toast.success("Subcategory added successfully");
            handleCloseAddModal();
            if (categoryId) fetchSubCategories(categoryId, page);
        } catch (error: any) {
            console.error("Error adding subcategory:", error);
            toast.error(error?.response?.data?.message || "Failed to add subcategory");
        } finally {
            setIsAddSubmitting(false);
        }
    };

    // ── History helpers ───────────────────────────────────────────────────────
    const handleOpenHistoryModal = (subcategory: any) => {
        setSelectedSubcategoryForHistory(subcategory);
        setHistoryPage(1);
        setIsHistoryModalOpen(true);
        fetchHistory(subcategory.id || subcategory.subCategoryId || subcategory._id, 1);
    };

    const handleCloseHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedSubcategoryForHistory(null);
        setHistoryData([]);
    };

    const fetchHistory = async (subCategoryId: number, currentPage: number = 1) => {
        setHistoryLoading(true);
        try {
            const res = await getSubCategoryHistory(subCategoryId, currentPage, 10);
            setHistoryData(res?.data?.data || []);
            setHistoryTotalRows(res?.data?.pagination?.total ?? res?.data?.data?.length ?? 0);
        } catch (error) {
            console.error("Error fetching subcategory history:", error);
            toast.error("Failed to load subcategory history");
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (isHistoryModalOpen && selectedSubcategoryForHistory) {
            fetchHistory(selectedSubcategoryForHistory.id || selectedSubcategoryForHistory.subCategoryId || selectedSubcategoryForHistory._id, historyPage);
        }
    }, [historyPage]);

    // ── Logout ────────────────────────────────────────────────────────────────
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

    const columns: Column[] = [
        {
            key: "id",
            label: "ID",
            render: (row: any) => row.id || row.subCategoryId || row._id || "N/A"
        },
        {
            key: "name",
            label: "Sub Category Name",
            render: (row: any) => row.name || row.subCategoryName || row.title || "N/A"
        },
        {
            key: "description",
            label: "Description",
            render: (row: any) => row.subCategoryDescription || row.description || "N/A"
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
                        <EditIcon fontSize="small" />
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
                        onClick={() => navigate(`/subcategories/${row.id || row.subCategoryId || row._id}/skus`, { state: { categoryId: Number(categoryId) } })}
                        title="View SKUs"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="Sub Categories"
                description={`Viewing sub categories for category ${categoryId}`}
                actionButton={
                    <div className="flex items-center gap-3">
                        <ExportButton exporter={exportSubcategories} reportName="Subcategories List" />
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
                            Add New Sub Category
                        </button>
                        <button
                            onClick={() => navigate('/categories')}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                            <ArrowBackIcon fontSize="small" />
                            Back to Categories
                        </button>
                    </div>
                }
                logout={logout}
            />

            <div className="mt-6 px-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="text-gray-600">Loading subcategories...</div>
                        </div>
                    ) : (
                        <CustomTable
                            columns={columns}
                            data={subCategories}
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
                            <h3 className="text-xl font-semibold text-gray-900">Edit Subcategory</h3>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subcategory Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter subcategory name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter subcategory description"
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
                                    <span className="ml-2 text-sm text-gray-700">
                                        Is Active
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleCloseEditModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Modal ──────────────────────────────────────────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Add New Subcategory</h3>
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
                                    Subcategory Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={addForm.subCategoryName}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, subCategoryName: e.target.value }))}
                                    placeholder="Enter subcategory name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                    value={addForm.subCategoryDescription}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, subCategoryDescription: e.target.value }))}
                                    placeholder="Enter subcategory description"
                                />
                            </div>

                            {/* Read-only context */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category ID</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                    value={categoryId || "—"}
                                    readOnly
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleCloseAddModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    disabled={isAddSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSubmit}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                    disabled={isAddSubmitting}
                                >
                                    {isAddSubmitting ? "Adding..." : "Add Subcategory"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Subcategory History Modal ────────────────────────────────────────────── */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Subcategory History</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedSubcategoryForHistory?.subCategoryName || selectedSubcategoryForHistory?.name}
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
                                <div className="text-center py-8 text-gray-500">No history records found for this Subcategory.</div>
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

            <SubCategoryBulkUpload
                isOpen={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                onUpload={() => {
                    if (categoryId) fetchSubCategories(categoryId, page);
                }}
            />
        </div>
    );
};

export default SubCategories;
