import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CONFIRMATION_TEXT = "DELETE";

const DeleteAccount: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [details, setDetails] = useState("");
    const [confirmationInput, setConfirmationInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isForgotPasswordPopupOpen, setIsForgotPasswordPopupOpen] = useState(false);

    const isFormValid = useMemo(() => {
        return (
            username.trim().length > 0 &&
            password.trim().length > 0 &&
            confirmationInput.trim() === CONFIRMATION_TEXT
        );
    }, [username, password, confirmationInput]);

    const handleDeleteAccount = async () => {
        if (!isFormValid || isDeleting) {
            return;
        }

        setIsDeleting(true);
        setUsername("");
        setPassword("");
        setDetails("");
        setConfirmationInput("");
        setIsForgotPasswordPopupOpen(false);
        toast.success("Your account will be deleted within 72 hours.", {
            position: "top-center",
        });
        await new Promise((resolve) => setTimeout(resolve, 1800));
        setIsDeleting(false);
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            {/* <TopBar
                title="Delete Account"
                description="Request permanent account deletion"
                logout={logout}
                hideNotificationIcon
            /> */}

            <div className="p-4 md:p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5 md:p-8">
                        <div className="mb-6">
                            {/* <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                                <i className="fas fa-exclamation-triangle" />
                                Irreversible Action
                            </div> */}
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                Delete your account permanently
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
                                This action permanently deletes account access from this portal. To continue, type{" "}
                                <span className="font-semibold text-gray-900">DELETE</span> in the confirmation field.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="delete-username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    id="delete-username"
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="delete-password"
                                    type="password"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPasswordPopupOpen(true)}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div>
                                <label htmlFor="delete-details" className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional details (optional)
                                </label>
                                <textarea
                                    id="delete-details"
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
                                    placeholder="Tell us a bit more..."
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="delete-confirm" className="block text-sm font-medium text-gray-700 mb-2">
                                    Type DELETE to confirm
                                </label>
                                <input
                                    id="delete-confirm"
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="DELETE"
                                    value={confirmationInput}
                                    onChange={(e) => setConfirmationInput(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    disabled={!isFormValid || isDeleting}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                                >
                                    {isDeleting ? "Deleting..." : "Delete Account"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isForgotPasswordPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                            <button
                                type="button"
                                onClick={() => setIsForgotPasswordPopupOpen(false)}
                                aria-label="Close popup"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <p className="mt-3 text-sm md:text-base text-gray-700">
                            Use your mobile application to reset password.
                        </p>
                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsForgotPasswordPopupOpen(false)}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;
