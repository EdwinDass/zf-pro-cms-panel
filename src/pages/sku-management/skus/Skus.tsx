import React, { useState, useEffect } from "react";
import CustomTable, { Column } from "../../../components/CustomTable";
import TopBar from "../../../layouts/top-bar";
import { getSkusBySubcategory, userLogout, editSku } from "../../../services/ApiService";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { logoutUser } from "../../../redux/slices/userDataSlice";
import { clearTokens } from "../../../redux/slices/authTokenSlice";

const Skus = () => {
    const { subcategoryId } = useParams();
    const [skus, setSkus] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSku, setEditingSku] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        skuName: "",
        skuDescription: "",
        isActive: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pageSize = 10;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (subcategoryId) {
            fetchSkus(subcategoryId);
        }
    }, [subcategoryId]);

    const fetchSkus = async (subCatId: string) => {
        setLoading(true);
        try {
            const res = await getSkusBySubcategory(Number(subCatId));
            setSkus(res?.data?.data || res?.data || []);
        } catch (error) {
            console.error("Error fetching SKUs:", error);
            toast.error("Failed to load SKUs");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (sku: any) => {
        setEditingSku(sku);
        setEditForm({
            skuName: sku.skuName || sku.name || sku.title || "",
            skuDescription: sku.skuDescription || sku.description || "",
            isActive: sku.isActive !== undefined ? sku.isActive : true
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingSku(null);
        setEditForm({ skuName: "", skuDescription: "", isActive: true });
    };

    const handleEditSubmit = async () => {
        if (!editingSku) return;
        setIsSubmitting(true);
        try {
            const skuId = editingSku.id || editingSku.skuId || editingSku._id;
            await editSku(skuId, {
                skuName: editForm.skuName,
                skuDescription: editForm.skuDescription,
                isActive: editForm.isActive
            });
            toast.success("SKU updated successfully");
            handleCloseEditModal();
            if (subcategoryId) fetchSkus(subcategoryId);
        } catch (error: any) {
            console.error("Error updating SKU:", error);
            toast.error(error?.response?.data?.message || "Failed to update SKU");
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
            render: (row: any) => row.id || row.skuId || row._id || "N/A"
        },
        {
            key: "skuCode",
            label: "SKU Code",
            render: (row: any) => row.skuCode || row.code || "N/A"
        },
        {
            key: "name",
            label: "SKU Name",
            render: (row: any) => row.skuName || row.name || row.title || "N/A"
        },
        {
            key: "description",
            label: "Description",
            render: (row: any) => row.skuDescription || row.description || "N/A"
        },
        {
            key: "points",
            label: "Points",
            render: (row: any) => row.points !== undefined ? row.points : "N/A"
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
                <button
                    className="text-blue-600 hover:text-blue-900 flex items-center"
                    onClick={() => handleEditClick(row)}
                >
                    <EditIcon fontSize="small" className="mr-1" /> Edit
                </button>
            )
        }
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="SKUs"
                description={`Viewing SKUs for subcategory ${subcategoryId}`}
                actionButton={
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        <ArrowBackIcon fontSize="small" />
                        Back
                    </button>
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
                            totalRows={skus.length}
                            currentPage={page}
                            onPageChange={(p) => setPage(p)}
                        />
                    )}
                </div>
            </div>

            {/* Edit SKU Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Edit SKU</h3>
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
                                    SKU Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editForm.skuName}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, skuName: e.target.value }))}
                                    placeholder="Enter SKU name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                    value={editForm.skuDescription}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, skuDescription: e.target.value }))}
                                    placeholder="Enter SKU description"
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

export default Skus;
