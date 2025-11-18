import React, { FC, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import GenerateQRCodes from "./components/qr-generation-form";
import QRBatchTable from "../qr-generation/components/qr-history";

import {
    getCategories,
    getSubcategoriesByCategory,
    getSkusByCategoryAndSubcategory,
    generateQRCodes,
    getQRHistory,
    getQRFile,
    getTotalGenerated,
    getTotalScans
} from "../../../services/ApiService";

import toast, { Toaster } from "react-hot-toast";
import QRStats from "./components/qr-stats";

interface CategoryItem {
    categoryId: number;
    categoryName: string;
}

interface SubCategoryItem {
    subCategoryId: number;
    subCategoryName: string;
}

interface SkuItem {
    skuId: number;
    skuName: string;
    skuCode: string;
}

interface QRBatch {
    batchId: number;
    skuCode: string;
    quantity: number;
    fileUrl: string;
    createdAt: string;
    isActive: boolean;
}

const QrGeneration: FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
    const [skus, setSkus] = useState<SkuItem[]>([]);
    const [qrHistory, setQrHistory] = useState<QRBatch[]>([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

    const [totalGenerated, setTotalGenerated] = useState<number>(0);
    const [totalScanned, setTotalScanned] = useState<number>(0);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Load categories & batch history
    useEffect(() => {
        fetchCategories();
        fetchQRHistory();
        fetchStatistics();
    }, []);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            toast.error("Failed to load categories");
        }
    };

    // Fetch QR Batch History
    const fetchQRHistory = async () => {
        try {
            const response = await getQRHistory();
            setQrHistory(response.data.qrHistory);
        } catch (err) {
            console.error("Error fetching QR history:", err);
            toast.error("Failed to load QR history");
        }
    };

    const fetchStatistics = async () => {
        try {
            // Fetch Generated QRs
            const genRes = await getTotalGenerated();
            setTotalGenerated(Number(genRes.data.data.totalCount || 0));

            // Fetch Total Scanned QRs
            const scanRes = await getTotalScans({});
            setTotalScanned(Number(scanRes.data.data.totalScans || 0));

        } catch (err) {
            console.error("Error fetching statistics:", err);
            toast.error("Failed to load QR statistics");
        }
    };


    // When category is selected
    const handleCategoryChange = async (categoryName: string) => {
        const selected = categories.find(c => c.categoryName === categoryName);
        if (!selected) return;

        setSelectedCategoryId(selected.categoryId);
        setSubCategories([]);
        setSkus([]);
        setSelectedSubCategoryId(null);

        try {
            const response = await getSubcategoriesByCategory(selected.categoryId);
            setSubCategories(response.data.data);
        } catch (err) {
            console.error("Error fetching subcategories:", err);
            toast.error("Failed to load subcategories");
        }
    };

    // When subcategory is selected
    const handleSubCategoryChange = async (subCategoryName: string) => {
        const selected = subCategories.find(s => s.subCategoryName === subCategoryName);
        if (!selected || !selectedCategoryId) return;

        setSelectedSubCategoryId(selected.subCategoryId);
        setSkus([]);

        try {
            const response = await getSkusByCategoryAndSubcategory(
                selectedCategoryId,
                selected.subCategoryId
            );
            setSkus(response.data.data);
        } catch (err) {
            console.error("Error fetching SKUs:", err);
            toast.error("Failed to load SKUs");
        }
    };

    // Generate QR codes
    const handleGenerate = async (formData: any) => {
        const { sku, numberOfQrs } = formData;

        const selectedSku = skus.find(s => s.skuName === sku);
        if (!selectedSku) {
            toast.error("Invalid SKU selected");
            return;
        }

        try {
            await generateQRCodes(Number(numberOfQrs), selectedSku.skuCode);

            toast.success("QR code generation in progress. Please check later.");

            // Refresh history
            fetchQRHistory();

        } catch (error) {
            console.error("Error generating QR Codes:", error);
            toast.error("Failed to generate QR Codes");
        }
    };

    // Cancel → clear form
    const handleCancel = () => {
        setSelectedCategoryId(null);
        setSelectedSubCategoryId(null);
        setSubCategories([]);
        setSkus([]);
        toast("Form cleared");
    };

    // Download QR batch file
    const handleDownload = async (item: QRBatch) => {
        try {
            const response = await getQRFile(item.batchId);
            const fileUrl = response.data.fileUrl;

            if (!fileUrl) {
                toast.error("Download link missing");
                return;
            }

            window.open(fileUrl, "_blank");
        } catch (err) {
            console.error("Error downloading file:", err);
            toast.error("Failed to download file");
        }
    };

    return (
        <>
            <Toaster position="top-right" />

            {/* QR Generator Form */}
            <GenerateQRCodes
                categories={categories.map(c => c.categoryName)}
                subCategories={subCategories.map(s => s.subCategoryName)}
                skuList={skus.map(s => s.skuName)}
                onCategoryChange={handleCategoryChange}
                onSubCategoryChange={handleSubCategoryChange}
                onSubmit={handleGenerate}
                onCancel={handleCancel}
            />

            {/* QR Batch Table */}
            <div className="mt-10">
                <QRBatchTable
                    data={qrHistory}
                    onDownload={handleDownload}
                />
            </div>

            {/* QR Stats */}
            <div className="w-1/2">
                <QRStats generated={totalGenerated} scanned={totalScanned} />
            </div>
        </>
    );
};

export default QrGeneration;
