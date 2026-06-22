import React from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "../layouts/Layouts";
import { useAppSelector } from "../redux/hooks";

interface PrivateRouteProps {
    element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const isAuthenticated = useAppSelector((state) => state.authToken.accessToken);

    return isAuthenticated ? <Layout>{element}</Layout> : <Navigate to="/" replace />;
};

export default PrivateRoute;