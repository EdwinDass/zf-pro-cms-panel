import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";
import CustomTable, { Column } from "../../components/CustomTable";
import { userLogout, getSurveyQuestions, createSurveyQuestion, deleteSurveyQuestion } from "../../services/ApiService";
import TopBar from "../../layouts/top-bar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";

export interface SurveyOption {
    optionId: number;
    questionId: number;
    optionText: string;
    isActive: boolean;
    createdAt: string;
}

export interface SurveyQuestion {
    questionId: number;
    questionText: string;
    answerType: string;
    isActive: boolean;
    createdAt: string;
    createdBy: number;
    options: SurveyOption[];
}

const SurveyQuestions = () => {
    const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

    const [questionText, setQuestionText] = useState("");
    const [answerType, setAnswerType] = useState("radio");
    const [options, setOptions] = useState<string[]>([""]);

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

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await getSurveyQuestions();
            if (response?.data?.data) {
                setQuestions(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch Survey Questions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleAddOption = () => {
        setOptions([...options, ""]);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length > 1) {
            setOptions(options.filter((_, i) => i !== index));
        } else {
            toast.error("At least one option is required");
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddSubmit = async () => {
        const trimmedQuestion = questionText.trim();
        const validOptions = options.map(opt => opt.trim()).filter(opt => opt !== "");

        if (!trimmedQuestion) {
            toast.error("Question text is required");
            return;
        }

        if (validOptions.length === 0) {
            toast.error("At least one valid option is required");
            return;
        }

        try {
            await createSurveyQuestion({
                questionText: trimmedQuestion,
                answerType: answerType,
                options: validOptions
            });
            toast.success("Survey Question added successfully");
            setOpenAddDialog(false);
            setQuestionText("");
            setAnswerType("radio");
            setOptions([""]);
            fetchQuestions();
        } catch (error) {
            toast.error("Failed to add Survey Question");
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedQuestionId === null) return;
        try {
            await deleteSurveyQuestion(selectedQuestionId);
            toast.success("Survey Question deleted successfully");
            setOpenDeleteDialog(false);
            setSelectedQuestionId(null);
            fetchQuestions();
        } catch (error) {
            toast.error("Failed to delete Survey Question");
        }
    };

    const columns: Column[] = [
        { key: "questionText", label: "Question", className: "w-1/3" },
        {
            key: "answerType",
            label: "Answer Type",
            render: (item: SurveyQuestion) => (
                <span className="capitalize">{item.answerType}</span>
            )
        },
        {
            key: "options",
            label: "Options",
            render: (item: SurveyQuestion) => (
                <div className="flex flex-wrap gap-1">
                    {item.options.map(opt => (
                        <span key={opt.optionId} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md">
                            {opt.optionText}
                        </span>
                    ))}
                </div>
            )
        },
        {
            key: "isActive",
            label: "Status",
            render: (item: SurveyQuestion) => (
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: SurveyQuestion) => (
                <IconButton
                    color="error"
                    onClick={() => {
                        setSelectedQuestionId(item.questionId);
                        setOpenDeleteDialog(true);
                    }}
                    title="Delete Question"
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <TopBar
                title="Survey Questions"
                description="Manage Survey Questions and Options"
                logout={logout}
                actionButton={
                    <button
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
                        onClick={() => setOpenAddDialog(true)}
                    >
                        <i className="fas fa-plus text-sm"></i> Add Question
                    </button>
                }
            />

            <div className="p-6">
                <CustomTable
                    columns={columns}
                    data={questions}
                    totalRows={questions.length}
                />
            </div>

            {/* Add Question Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle className="flex justify-between items-center m-0 p-4 border-b">
                    <Typography variant="h6" className="font-bold text-gray-900">Add Survey Question</Typography>
                    <IconButton onClick={() => setOpenAddDialog(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="p-6">
                    <div className="flex flex-col gap-4 mt-4">
                        <TextField
                            label="Question Text"
                            variant="outlined"
                            fullWidth
                            value={questionText}
                            onChange={(e) => setQuestionText(e?.target?.value)}
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel id="answer-type-label">Answer Type</InputLabel>
                            <Select
                                labelId="answer-type-label"
                                value={answerType}
                                label="Answer Type"
                                onChange={(e) => setAnswerType(e.target.value)}
                            >
                                <MenuItem value="radio">Radio (Single Choice)</MenuItem>
                                <MenuItem value="checkbox">Checkbox (Multiple Choice)</MenuItem>
                            </Select>
                        </FormControl>

                        <div className="mt-2">
                            <Typography variant="subtitle2" className="mb-2 font-medium text-gray-700">Options</Typography>
                            {options.map((opt, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                    <TextField
                                        label={`Option ${index + 1}`}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={opt}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        required
                                    />
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveOption(index)}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    {index === options.length - 1 && (
                                        <IconButton
                                            color="primary"
                                            onClick={handleAddOption}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    )}
                                </div>
                            ))}
                        </div>
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
                    <Typography className="text-gray-700">Are you sure you want to delete this Survey Question?</Typography>
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

export default SurveyQuestions;
