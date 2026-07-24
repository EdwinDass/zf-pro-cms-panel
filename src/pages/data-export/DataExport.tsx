import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import {
    getApplicationLoginReport,
    getregisteredUsersReport,
    getQrTransactionReport,
    getAdminreferralReport,
    getBankDetailsReport,
    getKycReport,
    getProductWiseReport,
    getCategoryReport,
    getErrorTransactionReport,
    getBlockedMemberReport,
    getBlockedMemberQrScanReport,
    getAnomalyTransactionsReport,
    getShockReplacementReport,
    getRedemptionHistory,
    getAdminOtpReport,
} from "../../services/ApiService";
import {
    ApplicationLoginReportKeys,
    RegisteredUsersReportKeys,
    QRTransactionReportKeys,
    RedemptionReportKeys,
    ReferralsReportKeys,
    OtpReportKeys,
    BankDetailsReportKeys,
    KycReportKeys,
    ProductWiseReportKeys,
    CategoryReportKeys,
    ErrorTransactionReportKeys,
    BlockedMemberReportKeys,
    BlockedMemberScanReportKeys,
    AnomalyTransactionsReportKeys,
    ShockReplacementReportKeys,
} from "../../utils/ExportKeyMappings";

// Icons from react-icons
import {
    FiDownload,
    FiFilter,
    FiUserCheck,
    FiUsers,
    FiGrid,
    FiRepeat,
    FiShare2,
    FiKey,
    FiCreditCard,
    FiShield,
    FiPackage,
    FiLayers,
    FiAlertCircle,
    FiUserX,
    FiAlertTriangle,
    FiTool,
    FiX,
} from "react-icons/fi";

interface ExportCardConfig {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    fetcher: (filters: any) => Promise<{ data: any[]; mappings: Record<string, string> }>;
}

export const DataExport: React.FC = () => {
    // Filter State
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [zone, setZone] = useState("");
    const [status, setStatus] = useState("");

    const [loadingCards, setLoadingCards] = useState<Record<string, boolean>>({});
    const [isExportingFull, setIsExportingFull] = useState(false);

    const zonesList = ["West", "South", "North", "East", "Central"];

    // Build payload params based on active filters
    const getActiveFilterParams = () => {
        const payload: Record<string, any> = {};
        if (fromDate) payload.fromDate = new Date(fromDate).toISOString();
        if (toDate) {
            const toDateObj = new Date(toDate);
            toDateObj.setHours(23, 59, 59, 999);
            payload.toDate = toDateObj.toISOString();
        }
        if (zone) payload.zone = zone;
        if (status) payload.status = status;
        return payload;
    };

    const hasActiveFilters = !!(fromDate || toDate || zone || status);

    const clearFilters = () => {
        setFromDate("");
        setToDate("");
        setZone("");
        setStatus("");
    };

    // Format row values
    const formatCell = (val: any) => {
        if (val === null || val === undefined || val === "") return "-";
        if (typeof val === "boolean") return val ? "Yes" : "No";
        return val;
    };

    const formatDate = (val: any) => {
        if (!val) return "-";
        try {
            const d = new Date(val);
            if (isNaN(d.getTime())) return String(val);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
        } catch {
            return String(val);
        }
    };

    // Exactly 15 Report Cards matching MIS & Analytics Report Categories
    const exportCards: ExportCardConfig[] = [
        {
            id: "application-login",
            title: "Application Login Report",
            subtitle: "User login activity, dates & devices",
            icon: <FiUserCheck />,
            fetcher: async (params) => {
                const res = await getApplicationLoginReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: ApplicationLoginReportKeys };
            },
        },
        {
            id: "registered-users",
            title: "Registered Users Report",
            subtitle: "Registered user profile details & status",
            icon: <FiUsers />,
            fetcher: async (params) => {
                const res = await getregisteredUsersReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: RegisteredUsersReportKeys };
            },
        },
        {
            id: "qr-transaction",
            title: "QR Transaction Report",
            subtitle: "QR scan transactions & point allocations",
            icon: <FiGrid />,
            fetcher: async (params) => {
                const res = await getQrTransactionReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: QRTransactionReportKeys };
            },
        },
        {
            id: "redemptions",
            title: "Redemptions",
            subtitle: "Reward redemption requests & status",
            icon: <FiRepeat />,
            fetcher: async (params) => {
                const res = await getRedemptionHistory({ limit: 10000, ...params });
                const list = res?.data?.reportList || res?.data?.data?.reportList || [];
                return { data: list, mappings: RedemptionReportKeys };
            },
        },
        {
            id: "referrals",
            title: "Referrals Report",
            subtitle: "User referral invites & points earned",
            icon: <FiShare2 />,
            fetcher: async (params) => {
                const res = await getAdminreferralReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: ReferralsReportKeys };
            },
        },
        {
            id: "otp",
            title: "OTP Report",
            subtitle: "OTP requests & verification logs",
            icon: <FiKey />,
            fetcher: async (params) => {
                const res = await getAdminOtpReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || res?.data?.reportList || [];
                return { data: list, mappings: OtpReportKeys };
            },
        },
        {
            id: "bank-details",
            title: "Bank Details Report",
            subtitle: "Bank account, IFSC & UPI details",
            icon: <FiCreditCard />,
            fetcher: async (params) => {
                const res = await getBankDetailsReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: BankDetailsReportKeys };
            },
        },
        {
            id: "kyc",
            title: "KYC Report",
            subtitle: "User KYC verification status & details",
            icon: <FiShield />,
            fetcher: async (params) => {
                const res = await getKycReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: KycReportKeys };
            },
        },
        {
            id: "product-wise",
            title: "Product Wise Report",
            subtitle: "Product scan count & points breakdown",
            icon: <FiPackage />,
            fetcher: async (params) => {
                const res = await getProductWiseReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: ProductWiseReportKeys };
            },
        },
        {
            id: "category",
            title: "Category Report",
            subtitle: "Category scan counts & bonus points",
            icon: <FiLayers />,
            fetcher: async (params) => {
                const res = await getCategoryReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: CategoryReportKeys };
            },
        },
        {
            id: "error-transaction",
            title: "Error Transaction Report",
            subtitle: "Failed scan logs & error diagnostics",
            icon: <FiAlertCircle />,
            fetcher: async (params) => {
                const res = await getErrorTransactionReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: ErrorTransactionReportKeys };
            },
        },
        {
            id: "blocked-member",
            title: "Blocked Member Report",
            subtitle: "Blocked accounts & activity summary",
            icon: <FiUserX />,
            fetcher: async (params) => {
                const res = await getBlockedMemberReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: BlockedMemberReportKeys };
            },
        },
        {
            id: "blocked-member-scan",
            title: "Blocked Member Scan",
            subtitle: "Scan attempts by blocked members",
            icon: <FiGrid />,
            fetcher: async (params) => {
                const res = await getBlockedMemberQrScanReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: BlockedMemberScanReportKeys };
            },
        },
        {
            id: "anomaly-transactions",
            title: "Anomaly Transactions",
            subtitle: "Data quality anomalies for review",
            icon: <FiAlertTriangle />,
            fetcher: async (params) => {
                const res = await getAnomalyTransactionsReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: AnomalyTransactionsReportKeys };
            },
        },
        {
            id: "shock-replacement",
            title: "Shock Replacement Report",
            subtitle: "Shock absorber replacements & SKUs",
            icon: <FiTool />,
            fetcher: async (params) => {
                const res = await getShockReplacementReport({ limit: 10000, ...params });
                const list = res?.data?.data?.reportList || [];
                return { data: list, mappings: ShockReplacementReportKeys };
            },
        },
    ];

    // Export single card to CSV or Excel
    const handleExportCard = async (card: ExportCardConfig, format: "csv" | "excel") => {
        setLoadingCards((prev) => ({ ...prev, [card.id]: true }));
        try {
            const params = getActiveFilterParams();
            const { data, mappings } = await card.fetcher(params);
            if (!data || data.length === 0) {
                toast.warn(`No data found for ${card.title}`);
                return;
            }

            const formattedRows = data.map((item: any) => {
                return Object.keys(mappings).reduce((acc: any, key: string) => {
                    const header = mappings[key];
                    let val = item[key];

                    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("time") || key === "dob" || key === "createdAt" || key === "updatedAt") {
                        val = formatDate(val);
                    } else {
                        val = formatCell(val);
                    }
                    acc[header] = val;
                    return acc;
                }, {});
            });

            const worksheet = XLSX.utils.json_to_sheet(formattedRows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, card.title.slice(0, 31));

            const cleanFileName = card.title.replace(/[^a-zA-Z0-9_\-]/g, "_");
            if (format === "csv") {
                XLSX.writeFile(workbook, `${cleanFileName}.csv`, { bookType: "csv" });
            } else {
                XLSX.writeFile(workbook, `${cleanFileName}.xlsx`, { bookType: "xlsx" });
            }
            toast.success(`${card.title} downloaded successfully (${format.toUpperCase()})`);
        } catch (error) {
            console.error(`Export error for ${card.title}:`, error);
            toast.error(`Failed to export ${card.title}`);
        } finally {
            setLoadingCards((prev) => ({ ...prev, [card.id]: false }));
        }
    };

    // Export Full Pack: Download single Excel workbook with sheets for all 15 reports
    const handleExportFullPack = async () => {
        setIsExportingFull(true);
        toast.info("Generating full export pack, please wait...");
        try {
            const params = getActiveFilterParams();
            const workbook = XLSX.utils.book_new();
            let addedSheets = 0;

            for (const card of exportCards) {
                try {
                    const { data, mappings } = await card.fetcher(params);
                    if (data && data.length > 0) {
                        const formattedRows = data.map((item: any) => {
                            return Object.keys(mappings).reduce((acc: any, key: string) => {
                                const header = mappings[key];
                                let val = item[key];
                                if (key.toLowerCase().includes("date") || key.toLowerCase().includes("time") || key === "dob" || key === "createdAt") {
                                    val = formatDate(val);
                                } else {
                                    val = formatCell(val);
                                }
                                acc[header] = val;
                                return acc;
                            }, {});
                        });

                        const worksheet = XLSX.utils.json_to_sheet(formattedRows);
                        const sheetName = card.title.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 31);
                        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
                        addedSheets++;
                    }
                } catch (e) {
                    console.warn(`Could not include ${card.title} in full pack:`, e);
                }
            }

            if (addedSheets === 0) {
                toast.warn("No data available across reports for full pack");
                return;
            }

            XLSX.writeFile(workbook, `ZF_ProPoints_Full_Data_Export_Pack.xlsx`, { bookType: "xlsx" });
            toast.success("Full data export pack downloaded successfully!");
        } catch (error) {
            console.error("Error generating full pack:", error);
            toast.error("Failed to generate full export pack");
        } finally {
            setIsExportingFull(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Data Export</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Generate and download reports in CSV or Excel format
                    </p>
                </div>

                <button
                    onClick={handleExportFullPack}
                    disabled={isExportingFull}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-60 justify-center cursor-pointer"
                >
                    <FiDownload className="text-base" />
                    {isExportingFull ? "Generating full pack..." : "Export full pack"}
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                        <FiFilter className="text-sm" />
                        <span>Scope Filters</span>
                    </div>

                    <div className="w-[180px]">
                        <input
                            type="date"
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            placeholder="From Date"
                        />
                    </div>

                    <div className="w-[180px]">
                        <input
                            type="date"
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            placeholder="To Date"
                        />
                    </div>

                    <select
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-blue-500 cursor-pointer min-w-[130px]"
                    >
                        <option value="">All Zones</option>
                        {zonesList.map((z) => (
                            <option key={z} value={z}>{z}</option>
                        ))}
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1 cursor-pointer ml-auto"
                        >
                            <FiX className="text-xs" />
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-center gap-3 p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm text-xs sm:text-sm text-slate-600">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FiFilter className="text-xs" />
                </div>
                <span>
                    Exports respect the active filters above. Current scope:{" "}
                    <strong className="text-slate-800 font-semibold">
                        {zone ? `Zone: ${zone}` : "all-India"}
                        {fromDate && ` from ${fromDate}`}
                        {toDate && ` to ${toDate}`}
                    </strong>
                    . Downloads are generated in-browser (CSV / Excel) — no data leaves this device.
                </span>
            </div>

            {/* Grid of 15 Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {exportCards.map((card) => {
                    const isLoading = !!loadingCards[card.id];

                    return (
                        <div
                            key={card.id}
                            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                        >
                            {/* Card Header: Icon + Title + Subtitle */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                                    {card.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-bold text-slate-800 truncate" title={card.title}>
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Card Footer: CSV & Excel Buttons */}
                            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                                <button
                                    onClick={() => handleExportCard(card, "csv")}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50/70 text-blue-600 hover:bg-blue-100 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <FiDownload className="text-xs" />
                                    CSV
                                </button>

                                <button
                                    onClick={() => handleExportCard(card, "excel")}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50/70 text-blue-600 hover:bg-blue-100 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <FiDownload className="text-xs" />
                                    Excel
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DataExport;
