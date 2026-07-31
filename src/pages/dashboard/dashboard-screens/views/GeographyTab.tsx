import React, { useEffect, useState } from "react";
import StateMemberDensityChart from "./StateMemberDensityChart";
import DensityByStateChart from "./DensityByStateChart";
import Card from "../Card";
import { FaMapMarkedAlt, FaCity } from "react-icons/fa";
import { getGeographyStats } from "../../../../services/ApiService";

const GeographyTabContent: React.FC = () => {
    const [stats, setStats] = useState({
        statesCovered: 0,
        districtsActive: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGeographyStats()
            .then((res) => {
                const d = res?.data?.data || {};
                setStats({
                    statesCovered: d.statesCovered ?? 0,
                    districtsActive: d.districtsActive ?? 0
                });
            })
            .catch((err) => console.error("Geography stats error:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            {/* Top row: 2 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card
                    title="States Covered"
                    value={loading ? "..." : stats.statesCovered.toLocaleString()}
                    percentage="Active States"
                    percentageColor="text-blue-600"
                    icon={<FaMapMarkedAlt />}
                    iconColor="text-blue-500"
                />
                <Card
                    title="Districts Active"
                    value={loading ? "..." : stats.districtsActive.toLocaleString()}
                    percentage="Active Districts"
                    percentageColor="text-teal-600"
                    icon={<FaCity />}
                    iconColor="text-teal-500"
                />
            </div>

            {/* Middle row: State member density & Density by state side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StateMemberDensityChart />
                <DensityByStateChart />
            </div>
        </div>
    );
};

export default GeographyTabContent;
