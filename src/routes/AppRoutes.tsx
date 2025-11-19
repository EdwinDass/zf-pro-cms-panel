import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";
import PublicRoute from "../routes/PublicRoute";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import UserRoleManagement from "../pages/role-management/UserRoleManagement";
import Qr from "../pages/qr-management/Qr-management";
import Tickets from "../pages/tickets/tickets";
import ProcessManagement from "../pages/process-management/Processmanagement";
import Integrations from "../pages/integrations/Integrations";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<PublicRoute element={<Login />} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/role-management" element={<PrivateRoute element={<UserRoleManagement />} />} />
            <Route path="/qr" element={<PrivateRoute element={<Qr />} />} />
            <Route path="/tickets" element={<PrivateRoute element={<Tickets />} />} />
            <Route path="/process-management" element={<PrivateRoute element={<ProcessManagement />} />} />
            <Route path="/integrations" element={<PrivateRoute element={<Integrations />} />} />
        </Routes>
    );
};

export default AppRoutes;