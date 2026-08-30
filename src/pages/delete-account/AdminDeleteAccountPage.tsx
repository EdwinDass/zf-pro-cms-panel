import React, { useState } from "react";
import { toast } from "react-toastify";
import { deleteUserAccount } from "../../services/ApiService";

const CONFIRMATION_PHRASE = "DELETE";

type Step = "input" | "confirm";

const AdminDeleteAccountPage: React.FC = () => {
    const [step, setStep] = useState<Step>("input");
    const [mobile, setMobile] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const validateMobile = (value: string) => {
        if (!value.trim()) return "Mobile number is required";
        if (!/^\d{10}$/.test(value.trim())) return "Enter a valid 10-digit mobile number";
        return "";
    };

    const handleProceed = () => {
        const error = validateMobile(mobile);
        if (error) {
            setMobileError(error);
            return;
        }
        setMobileError("");
        setConfirmText("");
        setStep("confirm");
    };

    const handleDelete = async () => {
        if (confirmText !== CONFIRMATION_PHRASE || isDeleting) return;
        setIsDeleting(true);
        try {
            const res = await deleteUserAccount(mobile.trim());
            const data = res?.data;
            toast.success(data?.message || `Account for ${mobile} deleted successfully`);
            setMobile("");
            setConfirmText("");
            setStep("input");
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.responseMessage ||
                "Failed to delete account. Please try again.";
            toast.error(msg);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-[#f4f6fa]">
            <div className="w-full max-w-lg">
                {/* Page Header */}
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mb-4">
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Delete Account</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Permanently delete a user account and all associated data.
                    </p>
                </div>
                {/* Warning Banner */}
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-red-700">Irreversible Action</p>
                        <p className="text-xs text-red-600 mt-1 leading-relaxed">
                            Deleting an account permanently removes all transactions, KYC data, bank details,
                            redemptions, notifications, and activity logs. This cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800">
                                {step === "input" ? "Enter User Mobile Number" : "Confirm Deletion"}
                            </h2>
                            <p className="text-xs text-slate-500">
                                {step === "input"
                                    ? "Provide the mobile number of the account to delete"
                                    : `You are about to permanently delete: ${mobile}`}
                            </p>
                        </div>
                    </div>

                    {/* Step 1: Mobile Input */}
                    {step === "input" && (
                        <div className="px-6 py-6 space-y-5">
                            <div>
                                <label htmlFor="admin-delete-mobile" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Mobile Number
                                </label>
                                <input
                                    id="admin-delete-mobile"
                                    type="tel"
                                    maxLength={10}
                                    autoFocus
                                    className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 outline-none transition-all
                                        ${mobileError
                                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                                            : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                        }`}
                                    placeholder="Enter 10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                        setMobile(val);
                                        if (mobileError) setMobileError(validateMobile(val));
                                    }}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleProceed(); }}
                                />
                                {mobileError && (
                                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {mobileError}
                                    </p>
                                )}
                            </div>

                            <button
                                id="btn-admin-delete-proceed"
                                type="button"
                                onClick={handleProceed}
                                disabled={mobile.length !== 10}
                                className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Proceed to Delete
                            </button>
                        </div>
                    )}

                    {/* Step 2: Confirm */}
                    {step === "confirm" && (
                        <div className="px-6 py-6 space-y-5">
                            {/* Account badge */}
                            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-3">
                                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3.5 h-3.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-500">Account to permanently delete</p>
                                    <p className="text-sm font-bold text-slate-800">{mobile}</p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="admin-delete-confirm-text" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Type{" "}
                                    <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-xs tracking-widest font-mono">
                                        DELETE
                                    </span>{" "}
                                    to confirm
                                </label>
                                <input
                                    id="admin-delete-confirm-text"
                                    type="text"
                                    autoFocus
                                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all font-mono tracking-widest
                                        ${confirmText && confirmText !== CONFIRMATION_PHRASE
                                            ? "border-orange-300 bg-orange-50 focus:ring-2 focus:ring-orange-200"
                                            : confirmText === CONFIRMATION_PHRASE
                                                ? "border-green-400 bg-green-50 focus:ring-2 focus:ring-green-200"
                                                : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                        }`}
                                    placeholder="DELETE"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleDelete(); }}
                                />
                                {confirmText && confirmText !== CONFIRMATION_PHRASE && (
                                    <p className="text-xs text-orange-600 mt-1.5">
                                        Type exactly &ldquo;DELETE&rdquo; to enable the button
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setStep("input"); setConfirmText(""); }}
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    Back
                                </button>
                                <button
                                    id="btn-admin-delete-confirm"
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={confirmText !== CONFIRMATION_PHRASE || isDeleting}
                                    className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete Permanently"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-xs text-slate-400 text-center mt-4">
                    This action is restricted to Evolve Admin only.
                </p>
            </div>
        </div>
    );
};

export default AdminDeleteAccountPage;
