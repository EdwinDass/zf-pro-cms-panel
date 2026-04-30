import React, { useEffect } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatsRowOne from "./dashboard-screens/StatsRowOne";
import StatsRowTwo from "./dashboard-screens/StatsRowTwo";
import StatsRowThree from "./dashboard-screens/StatsRowThree";
import StatsRowFour from "./dashboard-screens/StatsRowFour";
import StatsRowFive from "./dashboard-screens/StatsRowFive";
import TopBar from "../../layouts/top-bar";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { getUserProfile, userLogout } from "../../services/ApiService";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('📊 Dashboard component mounted');
    }, []);

    const logout = async () => {
        try {
            console.log('🔐 Logging out user...');
            await userLogout();
        } catch (err) {
            console.error("❌ Logout API failed:", err);
        }

        dispatch(logoutUser());
        dispatch(clearTokens());
        console.log('✅ User logged out successfully');
        navigate("/");
    };

    return (
        <div className="h-screen overflow-y-auto pb-10">
            <TopBar logout={logout} />
            <div className="m-5">
                {console.log('📈 Rendering dashboard stats rows')}
                <StatsRowOne />
                <StatsRowTwo />
                <StatsRowThree />
                <StatsRowFour />
                <StatsRowFive />
            </div>
        </div>
    );
};

export default Dashboard;