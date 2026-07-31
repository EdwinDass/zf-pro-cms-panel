import React, { useEffect, useState } from "react";
import PointsIssuedVsRedeemedChart from "./reports/PointsIssuedVsRedeemedChart";
import TopMechanicsByZoneTable from "./reports/TopMechanicsByZoneTable";
import CategorySharePieChart from "../dashboard/dashboard-screens/views/CategorySharePieChart";
import { getUserStatusDistribution } from "../../services/ApiService";

interface UserStatusData {
    active: number;
    inactive: number;
    pending: number;
    total: number;
}

const MISDashboardView: React.FC = () => {
    const [statusData, setStatusData] = useState<UserStatusData>({
        active: 12400,
        inactive: 1800,
        pending: 650,
        total: 14850,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                const res = await getUserStatusDistribution();
                const apiData = res?.data?.data;
                if (apiData) {
                    setStatusData(apiData);
                }
            } catch (error) {
                console.error("Error fetching user status distribution:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    return (
        <div className="space-y-6 pb-12">
            {/* Top row: Enrollment Status KPI Summary Cards */}
            <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray mb-4">
                    Enrollment Status (KYC & User Status)
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                        <span className="text-xs font-semibold text-gray-400 block mb-1">
                            Total Registered
                        </span>
                        <span className="text-xl font-bold text-gray-900">
                            {statusData.total ? statusData.total.toLocaleString() : "0"}
                        </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                        <span className="text-xs font-semibold text-emerald-600 block mb-1">
                            KYC Approved / Active
                        </span>
                        <span className="text-xl font-bold text-emerald-600">
                            {statusData.active ? statusData.active.toLocaleString() : "0"}
                        </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                        <span className="text-xs font-semibold text-amber-600 block mb-1">
                            Pending Verification
                        </span>
                        <span className="text-xl font-bold text-amber-600">
                            {statusData.pending ? statusData.pending.toLocaleString() : "0"}
                        </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                        <span className="text-xs font-semibold text-rose-600 block mb-1">
                            Incomplete / Inactive
                        </span>
                        <span className="text-xl font-bold text-rose-600">
                            {statusData.inactive ? statusData.inactive.toLocaleString() : "0"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle row: Points Issued vs Redeemed & Redemption Channel Mix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                    <PointsIssuedVsRedeemedChart />
                </div>
                <div className="lg:col-span-5">
                    <CategorySharePieChart />
                </div>
            </div>

            {/* Bottom row: Top Mechanics by Zone */}
            <TopMechanicsByZoneTable />
        </div>
    );
};

export default MISDashboardView;
