import React, { useEffect, useMemo, useState } from "react";
import TopBar from "../../../layouts/top-bar";
import { toast } from "react-toastify";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
    addShockReplacementSku,
    api,
    getShockReplacementSkus,
    removeShockReplacementSku,
} from "../../../services/ApiService";

type SkuOption = {
    skuId: number | null;
    numericSku: number | null;
    skuCode: string;
    skuName: string;
    skuKey: string;
    originalSku: string | number | null;
    originalSkuCode: string | number | null;
};

const ShockReplacementSkus = () => {
    const [activeSkus, setActiveSkus] = useState<SkuOption[]>([]);
    const [replacementSkus, setReplacementSkus] = useState<SkuOption[]>([]);
    const [selectedSku, setSelectedSku] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isRemovingSkuKey, setIsRemovingSkuKey] = useState<string | null>(null);

    const toNumberOrNull = (value: any): number | null => {
        if (value === null || value === undefined || value === "") return null;
        const n = Number(value);
        return Number.isFinite(n) ? n : null;
    };

    const normalizeSku = (item: any): SkuOption => {
        const rawSkuCode = item?.skuCode ?? item?.sku_code ?? item?.sku ?? item?.code ?? item?.value;
        const skuCode = String(rawSkuCode ?? "").trim();
        const rawSkuId = item?.skuId ?? item?.sku_id ?? item?.id ?? item?.skuNumber ?? null;
        const parsedSkuId = toNumberOrNull(rawSkuId);
        const numericSkuFromCode = toNumberOrNull(rawSkuCode);
        const numericSkuFromSkuField = toNumberOrNull(item?.sku);
        // IMPORTANT: backend config is based on SKU code/value; never prioritize row id over sku_code.
        const numericSku = numericSkuFromCode ?? numericSkuFromSkuField ?? parsedSkuId;
        const skuKey = String(numericSku ?? skuCode);

        return {
            skuId: parsedSkuId,
            numericSku,
            skuCode,
            skuName: String(item?.skuName ?? item?.sku_name ?? item?.name ?? item?.title ?? ""),
            skuKey,
            // Store original values for delete operations
            originalSku: item?.sku ?? rawSkuCode,
            originalSkuCode: item?.sku_code ?? rawSkuCode,
        };
    };

    const getDataArray = (response: any): any[] => {
        if (Array.isArray(response?.data?.data)) return response.data.data;
        return [];
    };

    const getActiveSkuData = async () => {
        try {
            const activeResponse = await api.get("sku/active", { params: { page: 1, limit: 1000 } });
            const activeData = getDataArray(activeResponse);
            if (activeData.length > 0) {
                return activeData.map(normalizeSku);
            }
        } catch (error) {
            console.warn("GET /sku/active failed, using /sku/skus fallback", error);
        }

        const allSkusResponse = await api.get("sku/skus", { params: { page: 1, limit: 1000 } });
        const allSkus = getDataArray(allSkusResponse);
        return allSkus
            .filter((sku: any) => sku?.isActive !== false)
            .map(normalizeSku);
    };

    const fetchPageData = async () => {
        setLoading(true);
        try {
            const [activeSkusData, replacementRes] = await Promise.all([
                getActiveSkuData(),
                getShockReplacementSkus(),
            ]);

            const normalizedReplacement = getDataArray(replacementRes).map(normalizeSku);

            setActiveSkus(activeSkusData);
            setReplacementSkus(normalizedReplacement);
        } catch (error) {
            console.error("Error loading shock replacement SKU data:", error);
            toast.error("Failed to load shock replacement SKU data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData();
    }, []);

    const configuredSkuKeys = useMemo(
        () => new Set(replacementSkus.map((sku) => sku.skuKey).filter(Boolean)),
        [replacementSkus]
    );

    const availableSkus = useMemo(() => {
        return activeSkus.filter((sku) => {
            if (!sku.skuKey) return false;
            if (sku.numericSku === null) return false;
            if (configuredSkuKeys.has(sku.skuKey)) return false;
            return true;
        });
    }, [activeSkus, configuredSkuKeys]);

    const activeSkuMap = useMemo(() => {
        return activeSkus.reduce<Record<string, SkuOption>>((acc, sku) => {
            const keys = [
                sku.skuKey,
                sku.skuCode,
                sku.numericSku !== null ? String(sku.numericSku) : "",
                sku.skuId !== null ? String(sku.skuId) : "",
            ].filter(Boolean);

            keys.forEach((key) => {
                acc[key] = sku;
            });
            return acc;
        }, {});
    }, [activeSkus]);

    const replacementRows = useMemo(() => {
        return replacementSkus.map((sku) => {
            const fallback = activeSkuMap[sku.skuKey] || activeSkuMap[sku.skuCode] || activeSkuMap[String(sku.numericSku ?? "")];
            return {
                ...sku,
                skuCode: sku.skuCode || fallback?.skuCode || "",
                skuName: sku.skuName || fallback?.skuName || "",
                numericSku: sku.numericSku ?? fallback?.numericSku ?? null,
            };
        });
    }, [replacementSkus, activeSkuMap]);

    const handleAddSku = async () => {
        if (!selectedSku) {
            toast.error("Please select a SKU");
            return;
        }

        const numericSku = toNumberOrNull(selectedSku);
        if (numericSku === null) {
            toast.error("Valid numeric SKU is required");
            return;
        }

        setIsAdding(true);
        try {
            try {
                // Keep legacy CMS payload first.
                await addShockReplacementSku({ sku: numericSku, sku_code: numericSku });
            } catch (legacyError: any) {
                const message = legacyError?.response?.data?.message || "";
                const needsArrayPayload =
                    typeof message === "string" &&
                    message.includes("Request body must be a non-empty array of items with sku and quantity");

                if (!needsArrayPayload) {
                    throw legacyError;
                }

                // Backend may enforce mobile-style contract on this endpoint.
                await addShockReplacementSku([{ sku: numericSku, quantity: 1 }]);
            }
            toast.success("Shock replacement SKU added");
            await fetchPageData();
            setSelectedSku("");
        } catch (error: any) {
            console.error("Error adding shock replacement SKU:", error);
            toast.error(error?.response?.data?.message || "Failed to add shock replacement SKU");
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveSku = async (sku: SkuOption) => {
        const confirmed = window.confirm("Remove this SKU from shock replacement list?");
        if (!confirmed) return;

        // Use original values that match what was stored in backend
        const skuToDelete = sku.originalSku ?? sku.originalSkuCode ?? sku.numericSku ?? sku.skuCode;
        console.log("Removing SKU:", { sku, skuToDelete, skuKey: sku.skuKey });
        
        if (!skuToDelete) {
            toast.error("Valid SKU is required");
            return;
        }

        setIsRemovingSkuKey(sku.skuKey);
        try {
            await removeShockReplacementSku(skuToDelete);
            toast.success("Shock replacement SKU removed");
            await fetchPageData();
        } catch (error: any) {
            console.error("Error removing shock replacement SKU:", error);
            toast.error(error?.response?.data?.message || "Failed to remove shock replacement SKU");
        } finally {
            setIsRemovingSkuKey(null);
        }
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="Shock Replacement SKUs"
                description="Configure SKUs allowed for shock replacement"
            />

            <div className="mt-6 px-8 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add SKU to replacement list</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                        <select
                            value={selectedSku}
                            onChange={(e) => setSelectedSku(e.target.value)}
                            className="lg:col-span-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading || isAdding}
                        >
                            <option value="">
                                {loading ? "Loading SKUs..." : "-- Select SKU --"}
                            </option>
                            {availableSkus.map((sku) => (
                                <option key={sku.skuKey} value={String(sku.numericSku)}>
                                    {sku.skuCode} - {sku.skuName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddSku}
                            disabled={isAdding || loading}
                            className="lg:col-span-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                        >
                            {isAdding ? "Adding..." : "Add"}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Replacement SKU table</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SKU Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SKU Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                            Loading replacement SKUs...
                                        </td>
                                    </tr>
                                ) : replacementRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                            No replacement SKUs configured
                                        </td>
                                    </tr>
                                ) : (
                                    replacementRows.map((sku) => (
                                        <tr key={sku.skuKey || sku.skuCode} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-700">{sku.skuCode || "-"}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{sku.skuName || "-"}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <button
                                                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                    onClick={() => handleRemoveSku(sku)}
                                                    disabled={isRemovingSkuKey === sku.skuKey}
                                                    title="Remove SKU"
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShockReplacementSkus;
