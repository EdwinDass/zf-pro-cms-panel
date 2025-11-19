import React from "react";
import AddIcon from "@mui/icons-material/Add";
import TopBar from "../../layouts/top-bar";

const Integrations = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar
                title="Integrations"
                description="Monitor and manage third-party system integrations"
                actionButton={
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <AddIcon fontSize="small" />
                        Add Integration
                    </button>
                }
            />
            <div className="flex flex-col items-center justify-center h-[75vh] text-center px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Coming Soon!
                </h1>
                <p className="text-gray-500 text-lg">
                    The Integrations dashboard is being updated. Check back soon.
                </p>
            </div>
        </div>
    );
};

export default Integrations;