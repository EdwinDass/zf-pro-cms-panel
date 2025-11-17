import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatsRowOne from "./dashboard-screens/StatsRowOne";
import StatsRowTwo from "./dashboard-screens/StatsRowTwo";
import StatsRowThree from "./dashboard-screens/StatsRowThree";
import StatsRowFour from "./dashboard-screens/StatsRowFour";
import StatsRowFive from "./dashboard-screens/StatsRowFive";
import TopBar from "../../layouts/top-bar";

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="ml-6 mr-6 mt-6 h-screen">
            <TopBar />
            <StatsRowOne />
            <StatsRowTwo />
            <StatsRowThree />
            <StatsRowFour />
            <StatsRowFive />
        </div>
    );
};

export default Dashboard;