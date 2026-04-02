import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import CustomTable, { Column } from "../../components/CustomTable";
import { userLogout, getAssets, addAsset, editAsset, deleteAsset } from "../../services/ApiService";
import TopBar from "../../layouts/top-bar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";

export interface Asset {
    assetId: number;
    assetTitle: string;
    assetUrl: string;
    assetType?: string;
    assetDescription?: string;
    isActive: boolean;
}

const Assets = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(false);

    // Dialog states
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // Selected Asset state
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [assetType, setAssetType] = useState("");
    const [assetDescription, setAssetDescription] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const response = await getAssets();
            if (response?.data?.data) {
                setAssets(response.data.data);
            } else if (Array.isArray(response?.data)) {
                setAssets(response.data);
            } else if (Array.isArray(response)) {
                setAssets(response);
            }
        } catch (error) {
            toast.error("Failed to fetch Assets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const resetForm = () => {
        setName("");
        setLink("");
        setAssetType("");
        setAssetDescription("");
        setSelectedAsset(null);
    };

    const handleOpenAddDialog = () => {
        resetForm();
        setOpenAddDialog(true);
    };

    const handleOpenEditDialog = (asset: Asset) => {
        setSelectedAsset(asset);
        setName(asset.assetTitle);
        setLink(asset.assetUrl);
        setAssetType(asset.assetType || "");
        setAssetDescription(asset.assetDescription || "");
        setOpenEditDialog(true);
    };

    const handleAddSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedLink = link.trim();

        if (!trimmedName || !trimmedLink) {
            toast.error("Both name and link are required");
            return;
        }

        try {
            await addAsset({
                name: trimmedName,
                link: trimmedLink
            });
            toast.success("Asset added successfully");
            setOpenAddDialog(false);
            resetForm();
            fetchAssets();
        } catch (error) {
            toast.error("Failed to add Asset");
        }
    };

    const handleEditSubmit = async () => {
        if (!selectedAsset) return;

        const trimmedTitle = name.trim();
        const trimmedType = assetType.trim();
        const trimmedDescription = assetDescription.trim();
        if (!trimmedTitle) {
            toast.error("Asset title is required");
            return;
        }
        if (!trimmedType) {
            toast.error("Asset type is required");
            return;
        }
        if (!trimmedDescription) {
            toast.error("Asset description is required");
            return;
        }

        try {
            await editAsset(selectedAsset.assetId, {
                assetTitle: trimmedTitle,
                assetType: trimmedType,
                assetDescription: trimmedDescription,
                isActive: selectedAsset.isActive,
            });
            toast.success("Asset updated successfully");
            setOpenEditDialog(false);
            resetForm();
            fetchAssets();
        } catch (error) {
            toast.error("Failed to update Asset");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedAsset) return;
        try {
            // Delete approach: Call editAsset and change isActive = false, or call deleteAsset.
            // Using editAsset with isActive = false as per prompt "delete(is_active = false)"
            await editAsset(selectedAsset.assetId, {
                name: selectedAsset.name,
                link: selectedAsset.link,
                isActive: false
            });
            // If the backend has a delete api, it could alternatively be:
            // await deleteAsset(selectedAsset.assetId);

            toast.success("Asset deleted successfully");
            setOpenDeleteDialog(false);
            resetForm();
            fetchAssets();
        } catch (error) {
            toast.error("Failed to delete Asset");
        }
    };

    const columns: Column[] = [
        { key: "assetTitle", label: "Asset Name", className: "w-1/4" },
        {
            key: "assetUrl",
            label: "Asset Link",
            className: "w-1/2",
            render: (item: Asset) => (
                <div className="whitespace-pre-wrap break-words">
                    <a href={item.assetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {item.assetUrl}
                    </a>
                </div>
            )
        },
        {
            key: "isActive",
            label: "Status",
            render: (item: Asset) => (
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: Asset) => (
                <div className="flex items-center gap-2">
                    <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(item)}
                        title="Edit Asset"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => {
                            setSelectedAsset(item);
                            setOpenDeleteDialog(true);
                        }}
                        title="Delete Asset"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )
        }
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="Assets Management"
                description="Manage Resources & Assets"
                logout={logout}
                actionButton={
                    <button
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
                        onClick={handleOpenAddDialog}
                    >
                        <i className="fas fa-plus text-sm"></i> Add Asset
                    </button>
                }
            />

            <div className="p-6">
                <CustomTable
                    columns={columns}
                    data={assets}
                    totalRows={assets.length}
                />
            </div>

            {/* Add Asset Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle className="flex justify-between items-center m-0 p-4 border-b">
                    <Typography variant="h6" className="font-bold text-gray-900">Add New Asset</Typography>
                    <IconButton onClick={() => setOpenAddDialog(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="p-6">
                    <div className="flex flex-col gap-4 mt-4">
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Type"
                            variant="outlined"
                            fullWidth
                            value={assetType}
                            onChange={(e) => setAssetType(e.target.value)}
                            required
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            value={assetDescription}
                            onChange={(e) => setAssetDescription(e.target.value)}
                            required
                        />
                        <TextField
                            label="Link"
                            variant="outlined"
                            fullWidth
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4 border-t bg-gray-50">
                    <button onClick={() => setOpenAddDialog(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition mr-2">
                        Cancel
                    </button>
                    <button onClick={handleAddSubmit} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition">
                        Submit
                    </button>
                </DialogActions>
            </Dialog>

            {/* Edit Asset Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle className="flex justify-between items-center m-0 p-4 border-b">
                    <Typography variant="h6" className="font-bold text-gray-900">Edit Asset</Typography>
                    <IconButton onClick={() => setOpenEditDialog(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="p-6">
                    <div className="flex flex-col gap-4 mt-4">
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Link"
                            variant="outlined"
                            fullWidth
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4 border-t bg-gray-50">
                    <button onClick={() => setOpenEditDialog(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition mr-2">
                        Cancel
                    </button>
                    <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition">
                        Save Updates
                    </button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle className="border-b font-bold text-gray-900">Confirm Delete</DialogTitle>
                <DialogContent className="pt-6 pb-6">
                    <Typography className="text-gray-700">Are you sure you want to delete this Asset? It will be marked as inactive.</Typography>
                </DialogContent>
                <DialogActions className="p-4 border-t bg-gray-50">
                    <button onClick={() => setOpenDeleteDialog(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition mr-2">
                        Cancel
                    </button>
                    <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition">
                        Delete
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Assets;
