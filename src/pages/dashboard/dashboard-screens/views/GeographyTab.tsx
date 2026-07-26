import React from "react";
import StateMemberDensityChart from "./StateMemberDensityChart";
import DensityByStateChart from "./DensityByStateChart";

const GeographyTabContent: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Top row: State member density & Density by state side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StateMemberDensityChart />
                <DensityByStateChart />
            </div>
        </div>
    );
};

export default GeographyTabContent;
