import React, { useState } from "react";
import TopBar from "../../../layouts/top-bar";
import RedemptionReport from "./redemption-report.tsx/RedemptionReport";
import ApplicationLoginReport from "./application-login-report.tsx/ApplicationLoginReport";
import RegisteredUsersReport from "./registered-users-report.tsx/RegisteredUsersReport";
import QRTransactionReport from "./qr-transaction-report.tsx/QRTransactionReport";
import ReferralsReport from "./referrals-report.tsx/ReferralsReport";

// Icons
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GridViewIcon from "@mui/icons-material/GridView";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ShareIcon from "@mui/icons-material/Share";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupsIcon from "@mui/icons-material/Groups";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const Reports = () => {
    const [activeReport, setActiveReport] = useState("application-login");

    return (
        <div className="h-screen overflow-y-auto bg-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">

                {/* LEFT SIDEBAR */}
                <div className="bg-white rounded-xl shadow p-4 border border-gray-200 h-fit w-56">
                    <h3 className="text-lg font-semibold mb-3">Report Categories</h3>

                    <div className="space-y-1">

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

                        {/* QR Transactions */}
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
                                ${activeReport === "referrals" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                        >
                            <ShareIcon fontSize="small" />
                            <span className="text-[14px]">Referrals Report</span>
                        </button>

                        {/* 
                        ---------------------------------------------------
                        COMMENTED OUT AS REQUESTED
                        ---------------------------------------------------
                        */}

                        {/*
                        <button className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100">
                            <SportsEsportsIcon fontSize="small" />
                            <span className="text-[14px]">Gamification</span>
                        </button>

                        <button className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100">
                            <ReceiptLongIcon fontSize="small" />
                            <span className="text-[14px]">Compliance</span>
                        </button>

                        <button className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100">
                            <GroupsIcon fontSize="small" />
                            <span className="text-[14px]">Stakeholder-wise</span>
                        </button>

                        <button className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100">
                            <ShowChartIcon fontSize="small" />
                            <span className="text-[14px]">Sales & Marketing</span>
                        </button>

                        <button className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100">
                            <AccountBalanceIcon fontSize="small" />
                            <span className="text-[14px]">Bank/UPI</span>
                        </button>
                        */}

                    </div>
                </div>

                {/* RIGHT CONTENT PANEL */}
                <div className="lg:col-span-3 h-full">
                    {activeReport === "application-login" && (
                        <div className="min-h-[80vh]">
                            <ApplicationLoginReport />
                        </div>
                    )}

                    {activeReport === "registered-users" && (
                        <div className="min-h-[80vh]">
                            <RegisteredUsersReport />
                        </div>
                    )}

                    {activeReport === "qr" && (
                        <div className="min-h-[80vh]">
                            <QRTransactionReport />
                        </div>
                    )}

                    {activeReport === "redemptions" && (
                        <div className="min-h-[80vh]">
                            <RedemptionReport />
                        </div>
                    )}

                    {activeReport === "referrals" && (
                        <div className="min-h-[80vh]">
                            <ReferralsReport />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;