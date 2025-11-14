import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";
import PublicRoute from "../routes/PublicRoute";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute element={<Login />} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            {/* Add more protected routes here */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;