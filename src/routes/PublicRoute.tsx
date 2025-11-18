import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface PublicRouteProps {
    element: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!sessionStorage.getItem("accessToken"));

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

export default PublicRoute;