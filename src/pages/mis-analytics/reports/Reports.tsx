// src/pages/mis-analytics/Reports.tsx

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import RedemptionReport from "./redemption-report/RedemptionReport";
import ApplicationLoginReport from "./application-login-report/ApplicationLoginReport";
import RegisteredUsersReport from "./registered-users-report/RegisteredUsersReport";
import QRTransactionReport from "./qr-transaction-report/QRTransactionReport";
import ReferralsReport from "./referrals-report/ReferralsReport";
import OtpReport from "./otp-report/OtpReport";
import BankDetailsReport from "./bank-details-report/BankDetailsReport";
import KycReport from "./kyc-report/KycReport";
import ProductWiseReport from "./product-wise-report/ProductWiseReport";
import CategoryReport from "./category-report/CategoryReport";
import ErrorTransactionReport from "./error-transaction-report/ErrorTransactionReport";
import NotificationReport from "./notification-report/NotificationReport";
import BlockedMemberReport from "./blocked-member-report/BlockedMemberReport";
import BlockedMemberScanReport from "./blocked-member-scan-report/BlockedMemberScanReport";
import AnomalyTransactionsReport from "./anomaly-transactions-report/AnomalyTransactionsReport";
import ShockReplacementReport from "./shock-replacement-report/ShockReplacementReport";

// Icons
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GridViewIcon from "@mui/icons-material/GridView";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ShareIcon from "@mui/icons-material/Share";
import GroupsIcon from "@mui/icons-material/Groups";
import PasswordIcon from "@mui/icons-material/Password";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ErrorIcon from "@mui/icons-material/Error";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BlockIcon from "@mui/icons-material/Block";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import BuildIcon from "@mui/icons-material/Build";


const Reports = () => {
    const location = useLocation();
    const [activeReport, setActiveReport] = useState("application-login");

    // AUTO SELECT QR REPORT WHEN COMING FROM DASHBOARD
    useEffect(() => {
        if (location.state?.report === "qr") {
            setActiveReport("qr");
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-gray-100 overflow-visible">

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 w-full overflow-hidden max-w-[1920px] mx-auto">

                {/* SIDEBAR */}
                <div className="bg-white rounded-xl shadow p-4 border border-gray-200 h-fit w-full md:w-auto">
                    <h3 className="text-lg font-semibold mb-3">Report Categories</h3>

                    <div className="space-y-2">

                        {/* Application Login */}
                        <button
                            onClick={() => setActiveReport("application-login")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "application-login"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <PersonAddAlt1Icon fontSize="small" />
                            <span className="text-[14px]">Application Login Report</span>
                        </button>

                        {/* Registered Users */}
                        <button
                            onClick={() => setActiveReport("registered-users")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 mt-1
                                ${activeReport === "registered-users"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <GroupsIcon fontSize="small" />
                            <span className="text-[14px]">Registered Users Report</span>
                        </button>

                        {/* QR */}
                        <button
                            onClick={() => setActiveReport("qr")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "qr" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                        >
                            <GridViewIcon fontSize="small" />
                            <span className="text-[14px]">QR Transaction Report</span>
                        </button>

                        {/* Redemptions */}
                        <button
                            onClick={() => setActiveReport("redemptions")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "redemptions"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <SyncAltIcon fontSize="small" />
                            <span className="text-[14px]">Redemptions</span>
                        </button>

                        {/* Referrals */}
                        <button
                            onClick={() => setActiveReport("referrals")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "referrals"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <ShareIcon fontSize="small" />
                            <span className="text-[14px]">Referrals Report</span>
                        </button>

                        {/* OTP Report */}
                        <button
                            onClick={() => setActiveReport("otp")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "otp"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <PasswordIcon fontSize="small" />
                            <span className="text-[14px]">OTP Report</span>
                        </button>

                        {/* Bank Details Report */}
                        <button
                            onClick={() => setActiveReport("bank-details")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "bank-details"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <AccountBalanceIcon fontSize="small" />
                            <span className="text-[14px]">Bank Details Report</span>
                        </button>

                        {/* KYC Report */}
                        <button
                            onClick={() => setActiveReport("kyc")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "kyc"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <VerifiedUserIcon fontSize="small" />
                            <span className="text-[14px]">KYC Report</span>
                        </button>

                        {/* Product Wise Report */}
                        <button
                            onClick={() => setActiveReport("product-wise")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "product-wise"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <InventoryIcon fontSize="small" />
                            <span className="text-[14px]">Product Wise Report</span>
                        </button>

                        {/* Category Report */}
                        <button
                            onClick={() => setActiveReport("category")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "category"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <CategoryIcon fontSize="small" />
                            <span className="text-[14px]">Category Report</span>
                        </button>

                        {/* Error Transaction Report */}
                        <button
                            onClick={() => setActiveReport("error-transaction")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "error-transaction"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <ErrorIcon fontSize="small" />
                            <span className="text-[14px]">Error Transaction Report</span>
                        </button>

                        {/* Notification Report */}
                        {/* <button
                            onClick={() => setActiveReport("notification")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "notification"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <NotificationsIcon fontSize="small" />
                            <span className="text-[14px]">Notification Report</span>
                        </button> */}

                        {/* Blocked Member Report */}
                        <button
                            onClick={() => setActiveReport("blocked-member")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "blocked-member"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <BlockIcon fontSize="small" />
                            <span className="text-[14px]">Blocked Member Report</span>
                        </button>

                        {/* Blocked Member Scan Report */}
                        <button
                            onClick={() => setActiveReport("blocked-member-scan")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "blocked-member-scan"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <QrCodeScannerIcon fontSize="small" />
                            <span className="text-[14px]">Blocked Member Scan</span>
                        </button>

                        {/* Anomaly Transactions Report */}
                        <button
                            onClick={() => setActiveReport("anomaly-transactions")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "anomaly-transactions"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <ReportProblemIcon fontSize="small" />
                            <span className="text-[14px]">Anomaly Transactions</span>
                        </button>

                        {/* Shock Replacement Report */}
                        <button
                            onClick={() => setActiveReport("shock-replacement")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "shock-replacement"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100"}`}
                        >
                            <BuildIcon fontSize="small" />
                            <span className="text-[14px]">Shock Replacement Report</span>
                        </button>

                    </div>
                </div>

                {/* RIGHT CONTENT AREA */}
                <div className="h-full min-w-0 overflow-auto">

                    {activeReport === "application-login" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <ApplicationLoginReport />
                        </div>
                    )}

                    {activeReport === "registered-users" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <RegisteredUsersReport />
                        </div>
                    )}

                    {activeReport === "qr" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <QRTransactionReport />
                        </div>
                    )}

                    {activeReport === "redemptions" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <RedemptionReport />
                        </div>
                    )}

                    {activeReport === "referrals" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <ReferralsReport />
                        </div>
                    )}

                    {activeReport === "otp" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <OtpReport />
                        </div>
                    )}

                    {activeReport === "bank-details" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <BankDetailsReport />
                        </div>
                    )}

                    {activeReport === "kyc" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <KycReport />
                        </div>
                    )}

                    {activeReport === "product-wise" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <ProductWiseReport />
                        </div>
                    )}

                    {activeReport === "category" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <CategoryReport />
                        </div>
                    )}

                    {activeReport === "error-transaction" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <ErrorTransactionReport />
                        </div>
                    )}

                    {activeReport === "notification" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <NotificationReport />
                        </div>
                    )}

                    {activeReport === "blocked-member" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <BlockedMemberReport />
                        </div>
                    )}

                    {activeReport === "blocked-member-scan" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <BlockedMemberScanReport />
                        </div>
                    )}

                    {activeReport === "anomaly-transactions" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <AnomalyTransactionsReport />
                        </div>
                    )}

                    {activeReport === "shock-replacement" && (
                        <div className="min-h-[80vh] px-4 md:px-6 lg:px-8">
                            <ShockReplacementReport />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Reports;