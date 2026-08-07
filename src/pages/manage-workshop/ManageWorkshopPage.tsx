import React from "react";
import TopBar from "../../layouts/top-bar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { userLogout } from "../../services/ApiService";
import ManageWorkshop from "../mis-analytics/reports/manage-workshop/ManageWorkshop";

const ManageWorkshopPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await userLogout();
        } catch (err) {
            console.error("Logout API failed:", err);
        }
        dispatch(logoutUser());
        dispatch(clearTokens());
        navigate("/");
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <div className="bg-white">
                <TopBar
                    title="Manage Workshops"
                    description="View, search and bulk upload workshop data"
                    logout={logout}
                />
            </div>
            <div className="mt-6 px-6">
                <ManageWorkshop />
            </div>
        </div>
    );
};

export default ManageWorkshopPage;
