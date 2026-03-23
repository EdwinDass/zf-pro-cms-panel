import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getNotificationMediaUrl } from "../../../services/ApiService";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
    notificationId?: number | null;
}

const ViewImageModal: React.FC<Props> = ({ isOpen, onClose, imageUrl, notificationId }) => {
    const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) {
            setResolvedUrl(null);
            return;
        }

        if (imageUrl && imageUrl.startsWith("http")) {
            setResolvedUrl(imageUrl);
        } else if (notificationId) {
            setLoading(true);
            getNotificationMediaUrl(notificationId)
                .then((res) => {
                    if (res?.success && res.url) {
                        setResolvedUrl(res.url);
                    } else {
                        setResolvedUrl(null);
                    }
                })
                .catch(() => setResolvedUrl(null))
                .finally(() => setLoading(false));
        } else {
            setResolvedUrl(null);
        }
    }, [isOpen, imageUrl, notificationId]);

    if (!isOpen || (!imageUrl && !notificationId)) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                    <h2 className="text-lg font-semibold">Notification Image</h2>

                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <CloseIcon />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                {/* Image */}
                <div className="p-4 flex justify-center bg-black min-h-[300px] items-center relative">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <svg className="animate-spin w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span>Loading image...</span>
                        </div>
                    ) : resolvedUrl ? (
                        <img
                            src={resolvedUrl}
                            alt="Notification Image"
                            className="max-h-[70vh] w-auto rounded-lg object-contain"
                        />
                    ) : (
                        <div className="text-gray-400">Failed to load image</div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ViewImageModal;
