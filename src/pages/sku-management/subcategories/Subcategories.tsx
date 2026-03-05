import React, { useState, useEffect } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import TopBar from "../../../layouts/top-bar";
import { getSubcategoriesByCategory, userLogout, editSubcategory } from "../../../services/ApiService";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { logoutUser } from "../../../redux/slices/userDataSlice";
import { clearTokens } from "../../../redux/slices/authTokenSlice";

const SubCategories = () => {
    const { categoryId } = useParams();
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        description: "",
        isActive: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pageSize = 10;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (categoryId) {
            fetchSubCategories(categoryId);
        }
    }, [categoryId]);

    const fetchSubCategories = async (catId: string) => {
        setLoading(true);
        try {
            const res = await getSubcategoriesByCategory(Number(catId));
            setSubCategories(res?.data?.data || res?.data || []);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            toast.error("Failed to load subcategories");
        } finally {
            setLoading(false);
        }
    };

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
            if (categoryId) fetchSubCategories(categoryId); // Refresh list
        } catch (error: any) {
            console.error("Error updating subcategory:", error);
            toast.error(error?.response?.data?.message || "Failed to update subcategory");
        } finally {
            setIsSubmitting(false);
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
                    >
                        <EditIcon fontSize="small" className="mr-1" /> Edit
                    </button>
                    <button
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        onClick={() => navigate(`/subcategories/${row.id || row.subCategoryId || row._id}/skus`, { state: { categoryId: Number(categoryId) } })}
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        View SKUs
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
                    <button
                        onClick={() => navigate('/categories')}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back to Categories
                    </button>
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
                            totalRows={subCategories.length}
                            currentPage={page}
                            onPageChange={(p) => setPage(p)}
                        />
                    )}
                </div>
            </div>

            {/* Edit Modal */}
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
        </div>
    );
};

export default SubCategories;
