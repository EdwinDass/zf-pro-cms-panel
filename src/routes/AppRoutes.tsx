import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";
import PublicRoute from "../routes/PublicRoute";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import UserRoleManagement from "../pages/role-management/UserRoleManagement";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute element={<Login />} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/role-management" element={<PrivateRoute element={<UserRoleManagement />} />} />
            {/* Add more protected routes here */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;