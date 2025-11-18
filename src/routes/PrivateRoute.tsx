import React, { useState } from "react";
import { Layout } from "../layouts/Layouts";
import Login from "../pages/auth/Login";
import { STORAGE_KEY } from "../services/tokenStorage";
import store, { RootState } from "../redux/store";

interface PrivateRouteProps {
    element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const isAuthenticated = store.getState()?.authToken?.accessToken;

    return isAuthenticated ? <Layout>{element}</Layout> : <Login/>;
};

export default PrivateRoute;