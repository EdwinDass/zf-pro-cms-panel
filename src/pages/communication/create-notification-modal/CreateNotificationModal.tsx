import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface CreateNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type NotificationType = "manual" | "scheduled" | "campaign";

interface ManualFormData {
    title: string;
    description: string;
    redirectionLink: string;
    image: File | null;
    imageUrl?: string;
    app: string;
    userType: string;
    userMobile: string;
    country: string;
}

interface ScheduledFormData extends ManualFormData {
    startDate: string;
    setTime: string;
}

interface CampaignFormData extends ManualFormData {
    campaignName: string;
    startDate: string;
    endDate: string;
    setTime: string;
    recurrence: "daily" | "weekly";
    weekday?: string;
}

const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<NotificationType>("manual");
    const [manualForm, setManualForm] = useState<ManualFormData>({
        title: "",
        description: "",
        redirectionLink: "",
        image: null,
        app: "",
        userType: "",
        userMobile: "",
        country: "",
    });

    const [scheduledForm, setScheduledForm] = useState<ScheduledFormData>({
        title: "",
        description: "",
        redirectionLink: "",
        image: null,
        app: "",
        userType: "",
        userMobile: "",
        country: "",
        startDate: "",
        setTime: "",
    });

    const [campaignForm, setCampaignForm] = useState<CampaignFormData>({
        title: "",
        description: "",
        redirectionLink: "",
        image: null,
        app: "",
        userType: "",
        userMobile: "",
        country: "",
        campaignName: "",
        startDate: "",
        endDate: "",
        setTime: "",
        recurrence: "daily",
        weekday: "",
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: NotificationType) => {
        const file = e.target.files?.[0] || null;
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') && file.size <= 5 * 1024 * 1024) {
            const imageUrl = URL.createObjectURL(file);
            if (type === "manual") {
                setManualForm({ ...manualForm, image: file, imageUrl });
            } else if (type === "scheduled") {
                setScheduledForm({ ...scheduledForm, image: file, imageUrl });
            } else {
                setCampaignForm({ ...campaignForm, image: file, imageUrl });
            }
        }
    };

    const handleCreate = () => {
        if (activeTab === "manual") {
            console.log("Creating manual notification:", manualForm);
        } else if (activeTab === "scheduled") {
            console.log("Creating scheduled notification:", scheduledForm);
        } else {
            console.log("Creating campaign notification:", campaignForm);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-900">Create Notifications</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Close modal"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 border-b border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => setActiveTab("manual")}
                        className={`flex-1 px-6 py-4 text-lg font-semibold ${activeTab === "manual"
                            ? "text-blue-500 border-b-4 border-blue-500"
                            : "text-gray-500 border-b-4 border-transparent"
                            } transition-all`}
                        title="Create manual notifications"
                    >
                        Manual Notifications
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("scheduled")}
                        className={`flex-1 px-6 py-4 text-lg font-semibold ${activeTab === "scheduled"
                            ? "text-blue-500 border-b-4 border-blue-500"
                            : "text-gray-500 border-b-4 border-transparent"
                            } transition-all`}
                        title="Create scheduled notifications"
                    >
                        Scheduled Notifications
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("campaign")}
                        className={`flex-1 px-6 py-4 text-lg font-semibold ${activeTab === "campaign"
                            ? "text-blue-500 border-b-4 border-blue-500"
                            : "text-gray-500 border-b-4 border-transparent"
                            } transition-all`}
                        title="Create notification campaigns"
                    >
                        Notification Campaigns
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Manual Tab */}
                    {activeTab === "manual" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="manualTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                        Title <span className="text-blue-500">*</span>
                                    </label>
                                    <input
                                        id="manualTitle"
                                        type="text"
                                        title="Enter notification title"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Title"
                                        value={manualForm.title}
                                        onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="manualRedirection" className="block text-sm font-medium text-gray-700 mb-2">
                                        Redirection Link
                                    </label>
                                    <input
                                        id="manualRedirection"
                                        type="text"
                                        title="Enter redirection link"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Redirection Link"
                                        value={manualForm.redirectionLink}
                                        onChange={(e) =>
                                            setManualForm({ ...manualForm, redirectionLink: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="manualDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-blue-500">*</span>
                                    </label>
                                    <textarea
                                        id="manualDescription"
                                        title="Enter notification description"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-[200px]"
                                        placeholder="Description"
                                        value={manualForm.description}
                                        onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="manualImage" className="block text-sm font-medium text-gray-700 mb-2">
                                        Image
                                    </label>
                                    <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
                                        <label htmlFor="manualImage" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                            {!manualForm.imageUrl ? (
                                                <>
                                                    <div className="text-blue-500 font-medium text-sm">
                                                        Attach files - Drag and drop (max 5MB, PNG, JPG, or JPEG)
                                                    </div>
                                                    <input
                                                        id="manualImage"
                                                        type="file"
                                                        hidden
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={(e) => handleImageChange(e, "manual")}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <img src={manualForm.imageUrl} alt="Preview" className="max-h-32 max-w-32 object-cover rounded" />
                                                    <p className="mt-2 text-gray-600 text-xs">{manualForm.image?.name}</p>
                                                    <input
                                                        id="manualImage"
                                                        type="file"
                                                        hidden
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={(e) => handleImageChange(e, "manual")}
                                                    />
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="manualNotificationType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Notification Type
                                    </label>
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                                        Manual
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="manualMobile" className="block text-sm font-medium text-gray-700 mb-2">
                                        User Mobile
                                    </label>
                                    <select
                                        id="manualMobile"
                                        title="Select user mobile"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={manualForm.userMobile}
                                        onChange={(e) =>
                                            setManualForm({ ...manualForm, userMobile: e.target.value })
                                        }
                                    >
                                        <option value="">Select User Mobile</option>
                                        <option value="+1-555-0101">+1-555-0101</option>
                                        <option value="+1-555-0102">+1-555-0102</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scheduled Tab */}
                    {activeTab === "scheduled" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="scheduledTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                        Title <span className="text-blue-500">*</span>
                                    </label>
                                    <input
                                        id="scheduledTitle"
                                        type="text"
                                        title="Enter notification title"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Title"
                                        value={scheduledForm.title}
                                        onChange={(e) =>
                                            setScheduledForm({ ...scheduledForm, title: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label htmlFor="scheduledRedirection" className="block text-sm font-medium text-gray-700 mb-2">
                                        Redirection Link
                                    </label>
                                    <input
                                        id="scheduledRedirection"
                                        type="text"
                                        title="Enter redirection link"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Redirection Link"
                                        value={scheduledForm.redirectionLink}
                                        onChange={(e) =>
                                            setScheduledForm({ ...scheduledForm, redirectionLink: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="scheduledDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-blue-500">*</span>
                                    </label>
                                    <textarea
                                        id="scheduledDescription"
                                        title="Enter notification description"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-[200px]"
                                        placeholder="Description"
                                        value={scheduledForm.description}
                                        onChange={(e) =>
                                            setScheduledForm({ ...scheduledForm, description: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label htmlFor="scheduledImage" className="block text-sm font-medium text-gray-700 mb-2">
                                        Image
                                    </label>
                                    <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
                                        <label htmlFor="scheduledImage" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                            {!scheduledForm.imageUrl ? (
                                                <>
                                                    <div className="text-blue-500 font-medium text-sm">
                                                        Attach files - Drag and drop (max 5MB, PNG, JPG, or JPEG)
                                                    </div>
                                                    <input
                                                        id="scheduledImage"
                                                        type="file"
                                                        hidden
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={(e) => handleImageChange(e, "scheduled")}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <img src={scheduledForm.imageUrl} alt="Preview" className="max-h-32 max-w-32 object-cover rounded" />
                                                    <p className="mt-2 text-gray-600 text-xs">{scheduledForm.image?.name}</p>
                                                    <input
                                                        id="scheduledImage"
                                                        type="file"
                                                        hidden
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={(e) => handleImageChange(e, "scheduled")}
                                                    />
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="scheduledStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        id="scheduledStartDate"
                                        type="date"
                                        title="Select start date"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={scheduledForm.startDate}
                                        onChange={(e) =>
                                            setScheduledForm({ ...scheduledForm, startDate: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
                                        Set Time
                                    </label>
                                    <input
                                        id="scheduledTime"
                                        type="time"
                                        title="Select time"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={scheduledForm.setTime}
                                        onChange={(e) =>
                                            setScheduledForm({ ...scheduledForm, setTime: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="scheduledNotificationType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Notification Type
                                    </label>
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                                        Scheduled
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="scheduledMobile" className="block text-sm font-medium text-gray-700 mb-2">
                                        User Mobile
                                    </label>
                                    <select
                                        id="scheduledMobile"
                                        title="Select user mobile"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={scheduledForm.userMobile}
                                        onChange={(e) =>
                                            setScheduledForm({ ...scheduledForm, userMobile: e.target.value })
                                        }
                                    >
                                        <option value="">Select User Mobile</option>
                                        <option value="+1-555-0101">+1-555-0101</option>
                                        <option value="+1-555-0102">+1-555-0102</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Campaign Tab */}
                    {activeTab === "campaign" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="campaignCampaignName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Campaign Name <span className="text-blue-500">*</span>
                                    </label>
                                    <input
                                        id="campaignCampaignName"
                                        type="text"
                                        title="Enter campaign name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Campaign Name"
                                        value={campaignForm.campaignName}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, campaignName: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label htmlFor="campaignTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                        Title <span className="text-blue-500">*</span>
                                    </label>
                                    <input
                                        id="campaignTitle"
                                        type="text"
                                        title="Enter notification title"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Title"
                                        value={campaignForm.title}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, title: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label htmlFor="campaignRedirection" className="block text-sm font-medium text-gray-700 mb-2">
                                        Redirection Link
                                    </label>
                                    <input
                                        id="campaignRedirection"
                                        type="text"
                                        title="Enter redirection link"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Redirection Link"
                                        value={campaignForm.redirectionLink}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, redirectionLink: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-blue-500">*</span>
                                    </label>
                                    <textarea
                                        id="campaignDescription"
                                        title="Enter notification description"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-[200px]"
                                        placeholder="Description"
                                        value={campaignForm.description}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, description: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label htmlFor="campaignImage" className="block text-sm font-medium text-gray-700 mb-2">
                                        Image
                                    </label>
                                    <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
                                        <label htmlFor="campaignImage" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                            {!campaignForm.imageUrl ? (
                                                <>
                                                    <div className="text-blue-500 font-medium text-sm">
                                                        Attach files - Drag and drop (max 5MB, PNG, JPG, or JPEG)
                                                    </div>
                                                    <input
                                                        id="campaignImage"
                                                        type="file"
                                                        hidden
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={(e) => handleImageChange(e, "campaign")}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <img
                                                        src={campaignForm.imageUrl}
                                                        alt="Preview"
                                                        className="max-h-32 max-w-32 object-cover rounded"
                                                    />
                                                    <p className="mt-2 text-gray-600 text-xs">{campaignForm.image?.name}</p>
                                                    <input
                                                        id="campaignImage"
                                                        type="file"
                                                        hidden
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={(e) => handleImageChange(e, "campaign")}
                                                    />
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="campaignStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        id="campaignStartDate"
                                        type="date"
                                        title="Select start date"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={campaignForm.startDate}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, startDate: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label htmlFor="campaignEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        id="campaignEndDate"
                                        type="date"
                                        title="Select end date"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={campaignForm.endDate}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, endDate: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="campaignTime" className="block text-sm font-medium text-gray-700 mb-2">
                                        Set Time
                                    </label>
                                    <input
                                        id="campaignTime"
                                        type="time"
                                        title="Select time"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={campaignForm.setTime}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, setTime: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label htmlFor="campaignRecurrence" className="block text-sm font-medium text-gray-700 mb-2">
                                        Recurrence
                                    </label>
                                    <select
                                        id="campaignRecurrence"
                                        title="Select recurrence"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={campaignForm.recurrence}
                                        onChange={(e) =>
                                            setCampaignForm({
                                                ...campaignForm,
                                                recurrence: e.target.value as "daily" | "weekly",
                                            })
                                        }
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                            </div>

                            {campaignForm.recurrence === "weekly" && (
                                <div>
                                    <label htmlFor="campaignWeekday" className="block text-sm font-medium text-gray-700 mb-2">
                                        Days of Week
                                    </label>
                                    <select
                                        id="campaignWeekday"
                                        title="Select weekday"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={campaignForm.weekday}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, weekday: e.target.value })
                                        }
                                    >
                                        <option value="">Select Day</option>
                                        <option value="monday">Monday</option>
                                        <option value="tuesday">Tuesday</option>
                                        <option value="wednesday">Wednesday</option>
                                        <option value="thursday">Thursday</option>
                                        <option value="friday">Friday</option>
                                        <option value="saturday">Saturday</option>
                                        <option value="sunday">Sunday</option>
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="campaignNotificationType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Notification Type
                                    </label>
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                                        Campaign
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="campaignMobile" className="block text-sm font-medium text-gray-700 mb-2">
                                        User Mobile
                                    </label>
                                    <select
                                        id="campaignMobile"
                                        title="Select user mobile"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={campaignForm.userMobile}
                                        onChange={(e) =>
                                            setCampaignForm({ ...campaignForm, userMobile: e.target.value })
                                        }
                                    >
                                        <option value="">Select User Mobile</option>
                                        <option value="+1-555-0101">+1-555-0101</option>
                                        <option value="+1-555-0102">+1-555-0102</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNotificationModal;