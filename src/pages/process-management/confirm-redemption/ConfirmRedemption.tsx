import { useState } from "react";

interface ConfirmRedemptionProps {
    isOpen: boolean;
    onClose: () => void;
    selectedData: any[];
    action: "approve" | "reject";
    onConfirm: (comments: { [key: string]: string }) => void;
}

const ConfirmRedemption: React.FC<ConfirmRedemptionProps> = ({
    isOpen,
    onClose,
    selectedData,
    action,
    onConfirm,
}) => {
    const [comments, setComments] = useState<{ [key: string]: string }>({});

    if (!isOpen) return null;

    const handleCommentChange = (redemptionRef: string, value: string) => {
        setComments(prev => ({ ...prev, [redemptionRef]: value }));
    };

    const handleSubmit = () => {
        onConfirm(comments);
        setComments({});
    };

    const handleCancel = () => {
        setComments({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className={`px-6 py-4 border-b ${action === "approve" ? "bg-green-50" : "bg-red-50"}`}>
                    <h2 className={`text-xl font-bold ${action === "approve" ? "text-green-700" : "text-red-700"}`}>
                        Confirm {action === "approve" ? "Approval" : "Rejection"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Review selected requests before {action === "approve" ? "approving" : "rejecting"}
                    </p>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Redemption Ref</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">User Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Points</th>

                                    {action === "reject" && (
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            Comment
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {selectedData.map((item) => (
                                    <tr key={item.redemptionRef} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {item.redemptionRef}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {item.userName}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {item.redeemedPoints}
                                        </td>

                                        {action === "reject" && (
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    placeholder="Add reason..."
                                                    value={comments[item.redemptionRef] || ""}
                                                    onChange={(e) => handleCommentChange(item.redemptionRef, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold">{selectedData.length}</span> request(s) selected
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className={`px-6 py-2 text-white rounded-lg font-medium transition ${action === "approve"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            Confirm {action === "approve" ? "Approval" : "Rejection"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConfirmRedemption;