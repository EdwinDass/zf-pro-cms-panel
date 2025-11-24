import React, { useState } from "react";
import RedemptionReport from "./redemption-report/RedemptionReport";
import ApplicationLoginReport from "./application-login-report/ApplicationLoginReport";
import RegisteredUsersReport from "./registered-users-report/RegisteredUsersReport";
import QRTransactionReport from "./qr-transaction-report/QRTransactionReport";
import ReferralsReport from "./referrals-report/ReferralsReport";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GridViewIcon from "@mui/icons-material/GridView";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ShareIcon from "@mui/icons-material/Share";
import GroupsIcon from "@mui/icons-material/Groups";

const Reports = () => {
    const [activeReport, setActiveReport] = useState("application-login");

    return (
        <div className="min-h-screen bg-gray-100 overflow-visible">

            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 p-2 w-full overflow-hidden">

                {/* SIDEBAR */}
                <div className="bg-white rounded-xl shadow p-4 border border-gray-200 h-fit w-full md:w-auto">
                    <h3 className="text-lg font-semibold mb-3">Report Categories</h3>

                    <div className="space-y-2">

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

                        <button
                            onClick={() => setActiveReport("qr")}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2
                                ${activeReport === "qr" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                        >
                            <GridViewIcon fontSize="small" />
                            <span className="text-[14px]">QR Transaction Report</span>
                        </button>

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

                </div>
            </div>
        </div>
    );
};

export default Reports;