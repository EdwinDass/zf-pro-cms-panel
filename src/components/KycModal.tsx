import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { updateKycRecords } from "../services/ApiService";

type KYCStatus = "Pending" | "Approved" | "Rejected";

interface KycDocument {
    detailId: number;
    kycType: string;
    kycDoc: string;
    docStatus: KYCStatus;
    kycCreatedAt: string;
    kycUpdatedAt: string | null;
    comment: string | null;
}

interface KycModalProps {
    isOpen: boolean;
    onClose: () => void;
    mechanicName: string;
    mechanicId: string;
    kycDocuments: KycDocument[];
}

const KycModal: React.FC<KycModalProps> = ({ isOpen, onClose, mechanicName, mechanicId, kycDocuments }) => {
    const [comments, setComments] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState<Record<number, boolean>>({});

    if (!isOpen) return null;

    const handleCommentChange = (detailId: number, value: string) => {
        setComments(prev => ({
            ...prev,
            [detailId]: value
        }));
    };

    const handleStatusUpdate = async (detailId: number, status: "Approved" | "Rejected") => {
        setLoading(prev => ({ ...prev, [detailId]: true }));

        try {
            const updates = [
                {
                    detailId,
                    status,
                    ...(comments[detailId] && { comment: comments[detailId] })
                }
            ];

            await updateKycRecords(updates);

            // Show success message
            alert(`Document ${status.toLowerCase()} successfully!`);

            // Close modal and refresh data
            onClose();
        } catch (error) {
            console.error("Error updating KYC record:", error);
            alert("Failed to update document status. Please try again.");
        } finally {
            setLoading(prev => ({ ...prev, [detailId]: false }));
        }
    };

    const getDocumentLabel = (kycType: string): string => {
        const labels: Record<string, string> = {
            "aadhaar-front": "Aadhaar Front",
            "aadhaar-back": "Aadhaar Back",
            "pan-front": "PAN Image",
            "pan-number": "PAN Number",
            "preferred-retailers": "Preferred Retailers"
        };
        return labels[kycType] || kycType;
    };

    const getDocumentIcon = (kycType: string) => {
        if (kycType.includes("aadhaar")) {
            return <InsertDriveFileIcon className="text-blue-600" fontSize="small" />;
        } else if (kycType.includes("pan")) {
            return <InsertDriveFileIcon className="text-purple-600" fontSize="small" />;
        } else {
            return <InsertDriveFileIcon className="text-green-600" fontSize="small" />;
        }
    };

    const getStatusBadge = (status: KYCStatus) => {
        const statusStyles = {
            Pending: "bg-orange-100 text-orange-600",
            Approved: "bg-green-100 text-green-600",
            Rejected: "bg-red-100 text-red-600"
        };

        return (
            <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyles[status]}`}>
                {status}
            </span>
        );
    };

    const renderDocumentDetails = (doc: KycDocument) => {
        if (doc.kycType === "pan-number") {
            return (
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono font-semibold text-gray-900">
                    {doc.kycDoc}
                </span>
            );
        } else if (doc.kycType === "preferred-retailers") {
            return (
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-900">
                    {doc.kycDoc} Retailer(s)
                </span>
            );
        } else {
            return (
                <button
                    type="button"
                    className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition flex items-center gap-2"
                    onClick={() => {
                        // TODO: Integrate view image API here
                        alert("View image API integration pending");
                    }}
                >
                    <VisibilityIcon fontSize="small" />
                    View Image
                </button>
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                >
                    <CloseIcon />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Documents</h2>
                <p className="text-sm text-gray-600 mb-6">{mechanicName} (ID: {mechanicId})</p>

                {/* KYC Documents Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Document Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Comment</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kycDocuments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No KYC documents found
                                    </td>
                                </tr>
                            ) : (
                                kycDocuments.map((doc) => (
                                    <tr key={doc.detailId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getDocumentIcon(doc.kycType)}
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getDocumentLabel(doc.kycType)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(doc.docStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderDocumentDetails(doc)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <input
                                                    type="text"
                                                    placeholder="Add comment"
                                                    value={comments[doc.detailId] || doc.comment || ""}
                                                    onChange={(e) => handleCommentChange(doc.detailId, e.target.value)}
                                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    disabled={doc.docStatus !== "Pending"}
                                                />
                                                {doc.comment && doc.docStatus !== "Pending" && (
                                                    <p className="text-xs text-gray-500 italic">
                                                        Previous: {doc.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {doc.docStatus === "Pending" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(doc.detailId, "Approved")}
                                                        disabled={loading[doc.detailId]}
                                                        className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {loading[doc.detailId] ? "..." : "Approve"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(doc.detailId, "Rejected")}
                                                        disabled={loading[doc.detailId]}
                                                        className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {loading[doc.detailId] ? "..." : "Reject"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">
                                                    {doc.docStatus === "Approved" ? "Approved" : "Rejected"}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mapped Retailers - TODO: Integrate API */}
                {/* {kycDocuments.some(doc => doc.kycType === "preferred-retailers") && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">Mapped Retailers</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Retailer ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50">
                                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                            Retailer mapping will be shown here
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )} */}

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KycModal;