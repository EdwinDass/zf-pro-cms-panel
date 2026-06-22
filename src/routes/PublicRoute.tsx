import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface PublicRouteProps {
    element: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
    const isAuthenticated = useAppSelector((state) => state.authToken.accessToken);

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

export default PublicRoute;