import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Divider } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import CustomTable, { Column } from "../../components/CustomTable";
import { userLogout, getSurveyResults } from "../../services/ApiService";
import TopBar from "../../layouts/top-bar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";

export interface SurveyResponseDetail {
    questionId: number;
    questionText: string;
    optionId: number;
    optionText: string;
}

export interface SurveyResult {
    responseId: number;
    userId: number;
    userName: string;
    userMobile: string;
    createdAt: string;
    details: SurveyResponseDetail[];
}

const SurveyResponses = () => {
    const [responses, setResponses] = useState<SurveyResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<SurveyResult | null>(null);

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

    const fetchResponses = async () => {
        try {
            setLoading(true);
            const res = await getSurveyResults();
            if (res?.data?.data) {
                setResponses(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch Survey Responses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResponses();
    }, []);

    const columns: Column[] = [
        { key: "userName", label: "User Name", className: "font-medium text-gray-800" },
        { key: "userMobile", label: "Mobile Number" },
        {
            key: "createdAt",
            label: "Submitted On",
            render: (item: SurveyResult) => (
                <span>{new Date(item.createdAt).toLocaleString()}</span>
            )
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: SurveyResult) => (
                <IconButton
                    color="primary"
                    onClick={() => {
                        setSelectedResponse(item);
                        setOpenViewDialog(true);
                    }}
                    title="View Survey Details"
                >
                    <VisibilityIcon />
                </IconButton>
            )
        }
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="Survey Responses"
                description="View user responses for surveys"
                logout={logout}
            />

            <div className="p-6">
                <CustomTable
                    columns={columns}
                    data={responses}
                    totalRows={responses.length}
                />
            </div>

            {/* View Details Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle className="flex justify-between items-center m-0 p-4 border-b">
                    <div>
                        <Typography variant="h6" className="font-bold text-gray-900">Survey Response Details</Typography>
                        {selectedResponse && (
                            <Typography variant="body2" className="text-gray-500 mt-1">
                                User: {selectedResponse.userName} ({selectedResponse.userMobile})
                            </Typography>
                        )}
                    </div>
                    <IconButton onClick={() => setOpenViewDialog(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="p-6">
                    {selectedResponse && selectedResponse.details && selectedResponse.details.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {selectedResponse.details.map((detail, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                                    <Typography variant="subtitle2" className="text-gray-900 font-semibold mb-2">
                                        Q{index + 1}: {detail.questionText}
                                    </Typography>
                                    <Divider className="my-2" />
                                    <Typography variant="body2" className="text-green-700 font-medium">
                                        Answer: {detail.optionText}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Typography className="text-gray-500 italic text-center py-4">
                            No answers found for this survey response.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SurveyResponses;
