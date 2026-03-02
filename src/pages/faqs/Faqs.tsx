import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import CustomTable, { Column } from "../../components/CustomTable";
import { userLogout, getFaqs, addFaq, deleteFaq } from "../../services/ApiService";
import TopBar from "../../layouts/top-bar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";

export interface FAQ {
    faqId: number;
    faqQuestion: string;
    faqAnswer: string;
    isActive: boolean;
    loading?: boolean;
}

const Faqs = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedFaqId, setSelectedFaqId] = useState<number | null>(null);

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

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

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const response = await getFaqs();
            if (response?.data?.data) {
                setFaqs(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch FAQs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleAddSubmit = async () => {
        const trimmedQuestion = question.trim();
        const trimmedAnswer = answer.trim();

        if (!trimmedQuestion || !trimmedAnswer) {
            toast.error("Both question and answer are required");
            return;
        }

        try {
            await addFaq({
                faqQuestion: trimmedQuestion,
                faqAnswer: trimmedAnswer
            });
            toast.success("FAQ added successfully");
            setOpenAddDialog(false);
            setQuestion("");
            setAnswer("");
            fetchFaqs();
        } catch (error) {
            toast.error("Failed to add FAQ");
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedFaqId === null) return;
        try {
            console.log(`Testing delete for FAQ ID: ${selectedFaqId}`);
            await deleteFaq(selectedFaqId);
            toast.success("FAQ deleted successfully");
            setOpenDeleteDialog(false);
            setSelectedFaqId(null);
            fetchFaqs();
        } catch (error) {
            toast.error("Failed to delete FAQ");
        }
    };

    const columns: Column[] = [
        { key: "faqQuestion", label: "Question", className: "w-1/4" },
        {
            key: "faqAnswer",
            label: "Answer",
            className: "w-1/2",
            render: (item: FAQ) => (
                <div className="whitespace-pre-wrap break-words">
                    {item.faqAnswer}
                </div>
            )
        },
        {
            key: "isActive",
            label: "Status",
            render: (item: FAQ) => (
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: FAQ) => (
                <IconButton
                    color="error"
                    onClick={() => {
                        setSelectedFaqId(item.faqId);
                        setOpenDeleteDialog(true);
                    }}
                    title="Delete FAQ"
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="FAQs Management"
                description="Manage Frequently Asked Questions"
                logout={logout}
                actionButton={
                    <button
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
                        onClick={() => setOpenAddDialog(true)}
                    >
                        <i className="fas fa-plus text-sm"></i> Add FAQ
                    </button>
                }
            />

            <div className="p-6">
                <CustomTable
                    columns={columns}
                    data={faqs}
                    totalRows={faqs.length}
                />
            </div>

            {/* Add FAQ Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle className="flex justify-between items-center m-0 p-4 border-b">
                    <Typography variant="h6" className="font-bold text-gray-900">Add New FAQ</Typography>
                    <IconButton onClick={() => setOpenAddDialog(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="p-6">
                    <div className="flex flex-col gap-4 mt-4">
                        <TextField
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={question}
                            onChange={(e) => setQuestion(e?.target?.value)}
                            required
                        />
                        <TextField
                            label="Answer"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={answer}
                            onChange={(e) => setAnswer(e?.target?.value)}
                            required
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4 border-t bg-gray-50">
                    <button onClick={() => setOpenAddDialog(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition mr-2">
                        Cancel
                    </button>
                    <button onClick={() => handleAddSubmit()} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition">
                        Submit
                    </button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle className="border-b font-bold text-gray-900">Confirm Delete</DialogTitle>
                <DialogContent className="pt-6 pb-6">
                    <Typography className="text-gray-700">Are you sure you want to delete this FAQ?</Typography>
                </DialogContent>
                <DialogActions className="p-4 border-t bg-gray-50">
                    <button onClick={() => setOpenDeleteDialog(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition mr-2">
                        Cancel
                    </button>
                    <button onClick={() => handleDeleteConfirm()} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition">
                        Delete
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Faqs;

