import React, { useState } from "react";
import CustomTable, { Column } from "../../components/CustomTable";
import ExcelUpload from "./components/ExcelUpload";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import ExporterButton from "../../components/ExportButton";
import TopBar from "../../layouts/top-bar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { userLogout, getAmazonProducts, editAmazonProduct } from "../../services/ApiService";
import ViewImageModal from "../tickets/components/ViewImageModal";

// Dummy interface for Amazon Products
// Updated interface matching API response
interface AmazonProduct {
    slno: string;
    productId: number;
    amazonAsinSku: string;
    amazonProductName: string;
    amazonProductUrl: string; // Image URL
    amazonCategory: string;
    amazonCategoryUrl: string;
    amazonStaticProductUrl: string | null;
    amazonStaticCategoryUrl: string | null;
    amazonStaticSubCategoryUrl: string | null;
    amazonSubCategory: string;
    amazonSubCategoryUrl: string;
    amazonMrp: string;
    amazonCspPrice: string;
    amazonDiscountedPrice: string;
    amazonPoints: string;
    amazonUrl: string | null;
    amazonCommentsVendor: string;
    amazonProductDescription: string;
}

const AmazonMarketplace: React.FC = () => {
    // Data States
    const [data, setData] = useState<AmazonProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [totalCount, setTotalCount] = useState(0);
    const [showExcelUpload, setShowExcelUpload] = useState(false);

    // Action States
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [headerMenuOpen, setHeaderMenuOpen] = useState(false); // New state for header menu
    const [viewData, setViewData] = useState<AmazonProduct | null>(null);
    const [editData, setEditData] = useState<AmazonProduct | null>(null);
    const [deleteMode, setDeleteMode] = useState(false);

    // Image Modal States
    const [viewImageModalOpen, setViewImageModalOpen] = useState(false);
    const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);

    const handleViewImage = (url: string) => {
        setViewImageUrl(url);
        setViewImageModalOpen(true);
    };

    // Edit Modal States
    const [activeTab, setActiveTab] = useState<"url" | "file">("url"); // Tab state
    const [editImageUrl, setEditImageUrl] = useState("");
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null); // Separate state for file preview

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const skip = (page - 1) * limit;
            const response = await getAmazonProducts({ limit, skip });
            if (response?.data?.reportList) {
                setData(response.data.reportList);
                setTotalCount(response.data.totalCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch Amazon products:", error);
            toast.error("Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [page]);

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

    const downloadExcelFormat = () => {
        const headers = [
            "amazonAsinSku", "amazonProductName", "amazonMrp", "amazonDiscountedPrice",
            "amazonPoints", "amazonInventoryCount", "amazonCategory", "amazonSubCategory",
            "amazonDescription", "amazonModelNo", "amazonStaticProductUrl",
            "amazonStaticCategoryUrl", "amazonStaticSubCategoryUrl"
        ];
        const ws = XLSX.utils.json_to_sheet([], { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Format");
        XLSX.writeFile(wb, "amazon_product_format.xlsx");
    };

    const fileExporter = async () => {
        return data;
    };

    const handleEdit = (row: AmazonProduct) => {
        setEditData(row);
        setActiveMenuId(null);
        // Initialize edit states
        setEditImageUrl(row.amazonProductUrl || "");
        setFilePreviewUrl(null); // Reset file preview
        setActiveTab(row.amazonProductUrl ? "url" : "file");
        setEditImageFile(null);
    };

    const handleView = (row: AmazonProduct) => {
        setViewData(row);
        setActiveMenuId(null);
    };



    const toggleMenu = (id: string) => {
        if (activeMenuId === id) {
            setActiveMenuId(null);
        } else {
            setActiveMenuId(id);
        }
    };



    const columns: Column[] = [
        { key: "productId", label: "Product ID" },
        { key: "amazonAsinSku", label: "ASIN/SKU" },
        {
            key: "amazonProductUrl",
            label: "Image",
            render: (row: AmazonProduct) => (
                row.amazonProductUrl ? (
                    <button
                        onClick={() => handleViewImage(row.amazonProductUrl)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-transparent border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                    >
                        View Image
                    </button>
                ) : (
                    <span className="text-gray-400 text-xs">-</span>
                )
            )
        },
        {
            key: "amazonProductName",
            label: "Product Name",
            render: (row: AmazonProduct) => (
                <span className="font-medium text-gray-900 truncate max-w-[200px] block" title={row.amazonProductName}>
                    {row.amazonProductName}
                </span>
            )
        },
        { key: "amazonCategory", label: "Category" },
        { key: "amazonMrp", label: "MRP" },
        { key: "amazonCspPrice", label: "CSP Price" },
        { key: "amazonDiscountedPrice", label: "Discounted Price" },
        { key: "amazonPoints", label: "Points" },
        {
            key: "actions",
            label: "Actions",
            render: (row: AmazonProduct) => (
                <div className="relative">
                    <button
                        onClick={() => toggleMenu(String(row.productId))}
                        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {activeMenuId === String(row.productId) && (
                        <div className="absolute right-10 top-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-50 py-1">
                            <button
                                onClick={() => {
                                    handleEdit(row);
                                    setDeleteMode(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <i className="fas fa-edit mr-2 text-blue-500"></i> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(row)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <i className="fas fa-trash-alt mr-2"></i> Delete
                            </button>
                            <button
                                onClick={() => handleView(row)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <i className="fas fa-eye mr-2"></i> View
                            </button>
                        </div>
                    )}
                </div>
            )
        }
    ];

    const handleDelete = (row: AmazonProduct) => {
        setEditData(row);
        setDeleteMode(true);
        // Initialize edit states (even though read-only for delete)
        setEditImageUrl(row.amazonProductUrl || "");
        setFilePreviewUrl(null);
        setActiveTab(row.amazonProductUrl ? "url" : "file");
        setEditImageFile(null);
    };

    const handleSubmit = async () => {
        if (!editData) return;

        const formData = new FormData();
        formData.append("productId", String(editData.productId));
        formData.append("isActive", deleteMode ? "false" : "true");

        if (!deleteMode) {
            formData.append("amazonProductName", editData.amazonProductName);
            formData.append("amazonMrp", editData.amazonMrp);
            formData.append("amazonDiscountedPrice", String(editData.amazonDiscountedPrice));

            // Image logic: send only ONE (either url or file)
            if (activeTab === "url" && editImageUrl) {
                formData.append("productImageUrl", editImageUrl);
            } else if (activeTab === "file" && editImageFile) {
                formData.append("productImage", editImageFile);
            }
        }

        try {
            await editAmazonProduct(formData);
            toast.success(deleteMode ? "Product deleted successfully" : "Product updated successfully");
            setEditData(null);
            fetchData(); // Refresh table
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product");
        }
    };

    const handleExcelUpload = () => {
        // Just refresh the data and close the modal
        fetchData();
        setShowExcelUpload(false);
    };

    const handleInputChange = (field: keyof AmazonProduct, value: string) => {
        if (editData) {
            setEditData({ ...editData, [field]: value });
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setEditImageUrl(url);
        // Clear file state when URL is used
        setFilePreviewUrl(null);
        setEditImageFile(null);
        // Update preview
        if (url) {
            setFilePreviewUrl(url); // Reusing filePreviewUrl state for generic preview
        } else {
            setFilePreviewUrl(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEditImageFile(file);
            setEditImageUrl(""); // Clear URL state

            // Create preview
            const objectUrl = URL.createObjectURL(file);
            setFilePreviewUrl(objectUrl);
        }
    };

    // Calculate which preview to show
    const displayPreviewUrl = filePreviewUrl || editImageUrl || (editData?.amazonProductUrl) || null;

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <div className="bg-white">
                <TopBar
                    title="Amazon Marketplace"
                    description="Manage your Amazon Marketplace products"
                    logout={logout}
                />
            </div>

            <div className="mt-6 px-8">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Products List</h3>
                        </div>

                        <div className="flex items-center space-x-3 relative">
                            <ExporterButton
                                exporter={fileExporter}
                                reportName="Amazon Marketplace"
                            />

                            {/* 3 DOTS MENU for Global Actions */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
                                >
                                    <i className="fas fa-ellipsis-v text-gray-600"></i>
                                </button>

                                {headerMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                                        <button
                                            onClick={() => {
                                                setHeaderMenuOpen(false);
                                                setShowExcelUpload(true);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <i className="fas fa-upload mr-2 text-blue-500"></i> Upload Excel
                                        </button>

                                        <button
                                            onClick={() => {
                                                setHeaderMenuOpen(false);
                                                downloadExcelFormat();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <i className="fas fa-download mr-2 text-gray-500"></i> Download Format
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <CustomTable
                        columns={columns}
                        data={data}
                        pageSize={limit}
                        totalRows={totalCount}
                        currentPage={page}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>

            <ExcelUpload
                isOpen={showExcelUpload}
                onClose={() => setShowExcelUpload(false)}
                onUpload={handleExcelUpload}
            />

            {/* VIEW DETAILS MODAL - IMPROVED UI */}
            {viewData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-3xl shadow-2xl m-4 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setViewData(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Product Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div className="space-y-4">
                                <div className="border-b border-gray-100 pb-2">
                                    <span className="block text-sm font-semibold text-gray-500 mb-1">Product Name</span>
                                    <div className="flex items-start justify-between">
                                        <span className="text-lg font-medium text-gray-900">{viewData.amazonProductName}</span>
                                        {viewData.amazonProductUrl && (
                                            <button
                                                onClick={() => handleViewImage(viewData.amazonProductUrl)}
                                                className="ml-2 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors flex items-center flex-shrink-0"
                                            >
                                                <i className="fas fa-image mr-1"></i> View Image
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="border-b border-gray-100 pb-2">
                                    <span className="block text-sm font-semibold text-gray-500 mb-1">ASIN/SKU</span>
                                    <span className="text-base text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded inline-block">{viewData.amazonAsinSku}</span>
                                </div>

                                <div className="border-b border-gray-100 pb-2">
                                    <span className="block text-sm font-semibold text-gray-500 mb-1">Category</span>
                                    <span className="text-base text-gray-900">{viewData.amazonCategory} &gt; {viewData.amazonSubCategory || "-"}</span>
                                </div>


                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-b border-gray-100 pb-2">
                                        <span className="block text-sm font-semibold text-gray-500 mb-1">MRP</span>
                                        <span className="text-base text-gray-900 font-medium">₹{viewData.amazonMrp}</span>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <span className="block text-sm font-semibold text-gray-500 mb-1">CSP Price</span>
                                        <span className="text-base text-gray-900 font-medium">₹{viewData.amazonCspPrice}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-b border-gray-100 pb-2">
                                        <span className="block text-sm font-semibold text-gray-500 mb-1">Discounted</span>
                                        <span className="text-base text-green-600 font-bold">₹{viewData.amazonDiscountedPrice}</span>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <span className="block text-sm font-semibold text-gray-500 mb-1">Points</span>
                                        <span className="text-base text-blue-600 font-bold">{viewData.amazonPoints}</span>
                                    </div>
                                </div>

                                <div className="border-b border-gray-100 pb-2">
                                    <span className="block text-sm font-semibold text-gray-500 mb-1">Vendor Comments</span>
                                    <span className="text-base text-gray-900">{viewData.amazonCommentsVendor || "No comments"}</span>
                                </div>
                            </div>
                        </div>

                        {/* PRODUCT LINKS SECTION */}
                        <div className="mt-6 mb-6">
                            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Product Links</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "Category URL", url: viewData.amazonCategoryUrl },
                                    { label: "SubCategory URL", url: viewData.amazonSubCategoryUrl },
                                ].map((link, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                        <span className="text-sm font-medium text-gray-600">{link.label}</span>
                                        {link.url ? (
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition shadow-sm flex items-center gap-1"
                                            >
                                                View <i className="fas fa-external-link-alt text-[10px]"></i>
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Not Available</span>
                                        )}
                                    </div>
                                ))
                                }
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <span className="block text-sm font-semibold text-gray-500 mb-2">Description</span>
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto">
                                {viewData.amazonProductDescription || "No description available."}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setViewData(null)}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Image Modal */}
            <ViewImageModal
                isOpen={viewImageModalOpen}
                onClose={() => setViewImageModalOpen(false)}
                imageUrl={viewImageUrl}
            />

            {/* EDIT MODAL - UPDATED TO MATCH VIEW UI */}
            {editData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-3xl shadow-2xl m-4 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setEditData(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        <h3 className={`text-2xl font-bold mb-6 border-b pb-4 ${deleteMode ? "text-red-700" : "text-gray-800"}`}>
                            {deleteMode ? "Delete Product" : "Edit Product"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        disabled={deleteMode}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                                        value={editData.amazonProductName}
                                        onChange={(e) => handleInputChange("amazonProductName", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ASIN/SKU</label>
                                    <input
                                        type="text"
                                        disabled={true}
                                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                                        value={editData.amazonAsinSku}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                        <input
                                            type="text"
                                            disabled={true}
                                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                                            value={editData.amazonCategory}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Sub Category</label>
                                        <input
                                            type="text"
                                            disabled={true}
                                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                                            value={editData.amazonSubCategory || ""}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">MRP</label>
                                        <input
                                            type="text"
                                            disabled={deleteMode}
                                            className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100"
                                            value={editData.amazonMrp}
                                            onChange={(e) => handleInputChange("amazonMrp", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">CSP Price</label>
                                        <input
                                            type="text"
                                            disabled={true} // CSP Price is fixed
                                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                                            value={editData.amazonCspPrice}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Discounted</label>
                                        <input
                                            type="text"
                                            disabled={deleteMode}
                                            className="w-full border border-gray-300 rounded-lg p-2 font-bold text-green-600 disabled:bg-gray-100"
                                            value={editData.amazonDiscountedPrice}
                                            onChange={(e) => handleInputChange("amazonDiscountedPrice", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Points</label>
                                        <input
                                            type="text"
                                            disabled={true}
                                            className="w-full border border-gray-300 rounded-lg p-2 font-bold text-blue-600 bg-gray-100"
                                            value={editData.amazonPoints}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor Comments</label>
                                    <input
                                        type="text"
                                        disabled={true}
                                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                                        value={editData.amazonCommentsVendor || ""}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* URL INPUTS SECTION - ALL DISABLED - REPLACED WITH VIEW BUTTONS */}
                        <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Product Links (Read Only)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "Category URL", val: editData.amazonCategoryUrl },
                                    { label: "SubCategory URL", val: editData.amazonSubCategoryUrl },
                                ].map((field, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200 shadow-sm">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">{field.label}</label>
                                        {field.val ? (
                                            <a
                                                href={field.val}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors flex items-center"
                                            >
                                                View <i className="fas fa-external-link-alt ml-1"></i>
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">N/A</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                disabled={true}
                                className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                                defaultValue={editData.amazonProductDescription}
                                rows={4}
                            />
                        </div>

                        {/* Image Upload Tabs */}
                        <div className={`mt-8 border rounded-xl overflow-hidden shadow-sm ${deleteMode ? "opacity-50 pointer-events-none" : ""}`}>
                            <div className="flex bg-gray-100 border-b">
                                <button
                                    className={`flex-1 py-3 text-sm font-medium text-center transition ${activeTab === "url"
                                        ? "bg-white text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    onClick={() => setActiveTab("url")}
                                >
                                    <i className="fas fa-link mr-2"></i> Image URL
                                </button>
                                <button
                                    className={`flex-1 py-3 text-sm font-medium text-center transition ${activeTab === "file"
                                        ? "bg-white text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    onClick={() => setActiveTab("file")}
                                >
                                    <i className="fas fa-cloud-upload-alt mr-2"></i> Upload File
                                </button>
                            </div>

                            <div className="p-5 bg-gray-50">
                                {activeTab === "url" && (
                                    <div className="animate-fadeIn">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Paste Image URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={editImageUrl}
                                            onChange={handleUrlChange}
                                        />
                                    </div>
                                )}

                                {activeTab === "file" && (
                                    <div className="animate-fadeIn">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Choose Image File</label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                                    <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Preview Area */}
                                {displayPreviewUrl && (
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Preview</p>
                                        <div className="flex justify-center border rounded-lg p-2 bg-white shadow-sm">
                                            <img
                                                src={displayPreviewUrl}
                                                alt="Preview"
                                                className="h-40 object-contain rounded"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3 border-t pt-5">
                            <button
                                onClick={() => setEditData(null)}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`px-5 py-2.5 text-white rounded-lg font-medium transition shadow-lg ${deleteMode
                                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                                    }`}
                            >
                                {deleteMode ? "Delete Product" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AmazonMarketplace;
