import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getNotificationRoles, getNotificationStates, getNotificationDistricts, getNotificationCities, getNotificationPincodes, getNotificationBlockStatuses, getNotificationUserCount } from "../../../services/ApiService";
import MultiSelectDropdown from "../../../components/ui/MultiSelectDropdown";

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
    roleIds: string[];
    stateNames: string[];
    districtNames: string[];
    cityNames: string[];
    pincodes: string[];
    blockStatuses: string[];
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
        roleIds: [],
        stateNames: [],
        districtNames: [],
        cityNames: [],
        pincodes: [],
        blockStatuses: [],
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
        roleIds: [],
        stateNames: [],
        districtNames: [],
        cityNames: [],
        pincodes: [],
        blockStatuses: [],
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
        roleIds: [],
        stateNames: [],
        districtNames: [],
        cityNames: [],
        pincodes: [],
        blockStatuses: [],
        campaignName: "",
        startDate: "",
        endDate: "",
        setTime: "",
        recurrence: "daily",
        weekday: "",
    });

    const [roles, setRoles] = useState<{ roleId: number; roleName: string }[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [manualDistricts, setManualDistricts] = useState<string[]>([]);
    const [scheduledDistricts, setScheduledDistricts] = useState<string[]>([]);
    const [campaignDistricts, setCampaignDistricts] = useState<string[]>([]);

    const [manualCities, setManualCities] = useState<string[]>([]);
    const [scheduledCities, setScheduledCities] = useState<string[]>([]);
    const [campaignCities, setCampaignCities] = useState<string[]>([]);

    const [manualPincodes, setManualPincodes] = useState<string[]>([]);
    const [scheduledPincodes, setScheduledPincodes] = useState<string[]>([]);
    const [campaignPincodes, setCampaignPincodes] = useState<string[]>([]);

    const [blockStatusOptions, setBlockStatusOptions] = useState<string[]>([]);

    const [manualUserCount, setManualUserCount] = useState<number | null>(null);
    const [scheduledUserCount, setScheduledUserCount] = useState<number | null>(null);
    const [campaignUserCount, setCampaignUserCount] = useState<number | null>(null);


    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [rolesRes, statesRes, blockStatusesRes] = await Promise.all([
                    getNotificationRoles(),
                    getNotificationStates(),
                    getNotificationBlockStatuses()
                ]);

                if (rolesRes && rolesRes.success) {
                    setRoles(rolesRes.data || []);
                }

                if (statesRes && statesRes.success && Array.isArray(statesRes.data)) {
                    const validStates = statesRes.data.filter((s: string) => s && s.trim() !== '');
                    const uniqueStates = Array.from(new Set(validStates)) as string[];
                    setStates(uniqueStates);
                }

                if (blockStatusesRes && blockStatusesRes.success && Array.isArray(blockStatusesRes.data)) {
                    setBlockStatusOptions(blockStatusesRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch notification filters:", error);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (manualForm.stateNames && manualForm.stateNames.length > 0) {
                try {
                    const res = await getNotificationDistricts(manualForm.stateNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setManualDistricts(res.data.filter((d: string) => d && d.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch districts for manual push:", error);
                }
            } else {
                setManualDistricts([]);
            }
        };
        fetchDistricts();
    }, [manualForm.stateNames]);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (scheduledForm.stateNames && scheduledForm.stateNames.length > 0) {
                try {
                    const res = await getNotificationDistricts(scheduledForm.stateNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setScheduledDistricts(res.data.filter((d: string) => d && d.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch districts for scheduled push:", error);
                }
            } else {
                setScheduledDistricts([]);
            }
        };
        fetchDistricts();
    }, [scheduledForm.stateNames]);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (campaignForm.stateNames && campaignForm.stateNames.length > 0) {
                try {
                    const res = await getNotificationDistricts(campaignForm.stateNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setCampaignDistricts(res.data.filter((d: string) => d && d.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch districts for campaign push:", error);
                }
            } else {
                setCampaignDistricts([]);
            }
        };
        fetchDistricts();
    }, [campaignForm.stateNames]);

    useEffect(() => {
        const fetchCities = async () => {
            if (manualForm.districtNames && manualForm.districtNames.length > 0) {
                try {
                    const res = await getNotificationCities(manualForm.districtNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setManualCities(res.data.filter((c: string) => c && c.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch cities for manual push:", error);
                }
            } else {
                setManualCities([]);
            }
        };
        fetchCities();
    }, [manualForm.districtNames]);

    useEffect(() => {
        const fetchCities = async () => {
            if (scheduledForm.districtNames && scheduledForm.districtNames.length > 0) {
                try {
                    const res = await getNotificationCities(scheduledForm.districtNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setScheduledCities(res.data.filter((c: string) => c && c.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch cities for scheduled push:", error);
                }
            } else {
                setScheduledCities([]);
            }
        };
        fetchCities();
    }, [scheduledForm.districtNames]);

    useEffect(() => {
        const fetchCities = async () => {
            if (campaignForm.districtNames && campaignForm.districtNames.length > 0) {
                try {
                    const res = await getNotificationCities(campaignForm.districtNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setCampaignCities(res.data.filter((c: string) => c && c.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch cities for campaign push:", error);
                }
            } else {
                setCampaignCities([]);
            }
        };
        fetchCities();
    }, [campaignForm.districtNames]);

    useEffect(() => {
        const fetchPincodes = async () => {
            if (manualForm.cityNames && manualForm.cityNames.length > 0) {
                try {
                    const res = await getNotificationPincodes(manualForm.cityNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setManualPincodes(res.data.map(String).filter((p: string) => p && p.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch pincodes for manual push:", error);
                }
            } else {
                setManualPincodes([]);
            }
        };
        fetchPincodes();
    }, [manualForm.cityNames]);

    useEffect(() => {
        const fetchPincodes = async () => {
            if (scheduledForm.cityNames && scheduledForm.cityNames.length > 0) {
                try {
                    const res = await getNotificationPincodes(scheduledForm.cityNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setScheduledPincodes(res.data.map(String).filter((p: string) => p && p.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch pincodes for scheduled push:", error);
                }
            } else {
                setScheduledPincodes([]);
            }
        };
        fetchPincodes();
    }, [scheduledForm.cityNames]);

    useEffect(() => {
        const fetchPincodes = async () => {
            if (campaignForm.cityNames && campaignForm.cityNames.length > 0) {
                try {
                    const res = await getNotificationPincodes(campaignForm.cityNames);
                    if (res && res.success && Array.isArray(res.data)) {
                        setCampaignPincodes(res.data.map(String).filter((p: string) => p && p.trim() !== ''));
                    }
                } catch (error) {
                    console.error("Failed to fetch pincodes for campaign push:", error);
                }
            } else {
                setCampaignPincodes([]);
            }
        };
        fetchPincodes();
    }, [campaignForm.cityNames]);

    // User count effects - fire on every filter change
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await getNotificationUserCount({
                    roleFilter: manualForm.roleIds.map(Number).filter(Boolean),
                    stateFilter: manualForm.stateNames,
                    districtFilter: manualForm.districtNames,
                    cityFilter: manualForm.cityNames,
                    pincodeFilter: manualForm.pincodes.map(Number).filter(Boolean),
                    blockStatusFilter: manualForm.blockStatuses,
                });
                if (res && res.success) setManualUserCount(res.count);
            } catch { /* silent */ }
        };
        fetchCount();
    }, [manualForm.roleIds, manualForm.stateNames, manualForm.districtNames, manualForm.cityNames, manualForm.pincodes, manualForm.blockStatuses]);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await getNotificationUserCount({
                    roleFilter: scheduledForm.roleIds.map(Number).filter(Boolean),
                    stateFilter: scheduledForm.stateNames,
                    districtFilter: scheduledForm.districtNames,
                    cityFilter: scheduledForm.cityNames,
                    pincodeFilter: scheduledForm.pincodes.map(Number).filter(Boolean),
                    blockStatusFilter: scheduledForm.blockStatuses,
                });
                if (res && res.success) setScheduledUserCount(res.count);
            } catch { /* silent */ }
        };
        fetchCount();
    }, [scheduledForm.roleIds, scheduledForm.stateNames, scheduledForm.districtNames, scheduledForm.cityNames, scheduledForm.pincodes, scheduledForm.blockStatuses]);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await getNotificationUserCount({
                    roleFilter: campaignForm.roleIds.map(Number).filter(Boolean),
                    stateFilter: campaignForm.stateNames,
                    districtFilter: campaignForm.districtNames,
                    cityFilter: campaignForm.cityNames,
                    pincodeFilter: campaignForm.pincodes.map(Number).filter(Boolean),
                    blockStatusFilter: campaignForm.blockStatuses,
                });
                if (res && res.success) setCampaignUserCount(res.count);
            } catch { /* silent */ }
        };
        fetchCount();
    }, [campaignForm.roleIds, campaignForm.stateNames, campaignForm.districtNames, campaignForm.cityNames, campaignForm.pincodes, campaignForm.blockStatuses]);


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

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="Role Filter"
                                        options={roles.map((r) => r.roleName)}
                                        selectedValues={roles.filter((r) => manualForm.roleIds.includes(String(r.roleId))).map((r) => r.roleName)}
                                        onChange={(values) => {
                                            const selectedIds = roles.filter((r) => values.includes(r.roleName)).map((r) => String(r.roleId));
                                            setManualForm({ ...manualForm, roleIds: selectedIds });
                                        }}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="State Filter"
                                        options={states}
                                        selectedValues={manualForm.stateNames}
                                        onChange={(values) => setManualForm({ ...manualForm, stateNames: values, districtNames: [], cityNames: [], pincodes: [] })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="District Filter"
                                        options={manualDistricts}
                                        selectedValues={manualForm.districtNames}
                                        onChange={(values) => setManualForm({ ...manualForm, districtNames: values, cityNames: [], pincodes: [] })}
                                        disabled={!manualForm.stateNames || manualForm.stateNames.length === 0}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="City Filter"
                                        options={manualCities}
                                        selectedValues={manualForm.cityNames}
                                        onChange={(values) => setManualForm({ ...manualForm, cityNames: values, pincodes: [] })}
                                        disabled={!manualForm.districtNames || manualForm.districtNames.length === 0}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="Pincode Filter"
                                        options={manualPincodes}
                                        selectedValues={manualForm.pincodes}
                                        onChange={(values) => setManualForm({ ...manualForm, pincodes: values })}
                                        disabled={!manualForm.cityNames || manualForm.cityNames.length === 0}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="Block Status Filter"
                                        options={blockStatusOptions}
                                        selectedValues={manualForm.blockStatuses}
                                        onChange={(values) => setManualForm({ ...manualForm, blockStatuses: values })}
                                    />
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

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="Role Filter"
                                        options={roles.map((r) => r.roleName)}
                                        selectedValues={roles.filter((r) => scheduledForm.roleIds.includes(String(r.roleId))).map((r) => r.roleName)}
                                        onChange={(values) => {
                                            const selectedIds = roles.filter((r) => values.includes(r.roleName)).map((r) => String(r.roleId));
                                            setScheduledForm({ ...scheduledForm, roleIds: selectedIds });
                                        }}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="State Filter"
                                        options={states}
                                        selectedValues={scheduledForm.stateNames}
                                        onChange={(values) => setScheduledForm({ ...scheduledForm, stateNames: values, districtNames: [], cityNames: [], pincodes: [] })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="District Filter"
                                        options={scheduledDistricts}
                                        selectedValues={scheduledForm.districtNames}
                                        onChange={(values) => setScheduledForm({ ...scheduledForm, districtNames: values, cityNames: [], pincodes: [] })}
                                        disabled={!scheduledForm.stateNames || scheduledForm.stateNames.length === 0}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="City Filter"
                                        options={scheduledCities}
                                        selectedValues={scheduledForm.cityNames}
                                        onChange={(values) => setScheduledForm({ ...scheduledForm, cityNames: values, pincodes: [] })}
                                        disabled={!scheduledForm.districtNames || scheduledForm.districtNames.length === 0}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="Pincode Filter"
                                        options={scheduledPincodes}
                                        selectedValues={scheduledForm.pincodes}
                                        onChange={(values) => setScheduledForm({ ...scheduledForm, pincodes: values })}
                                        disabled={!scheduledForm.cityNames || scheduledForm.cityNames.length === 0}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="Block Status Filter"
                                        options={blockStatusOptions}
                                        selectedValues={scheduledForm.blockStatuses}
                                        onChange={(values) => setScheduledForm({ ...scheduledForm, blockStatuses: values })}
                                    />
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

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="Role Filter"
                                        options={roles.map((r) => r.roleName)}
                                        selectedValues={roles.filter((r) => campaignForm.roleIds.includes(String(r.roleId))).map((r) => r.roleName)}
                                        onChange={(values) => {
                                            const selectedIds = roles.filter((r) => values.includes(r.roleName)).map((r) => String(r.roleId));
                                            setCampaignForm({ ...campaignForm, roleIds: selectedIds });
                                        }}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="State Filter"
                                        options={states}
                                        selectedValues={campaignForm.stateNames}
                                        onChange={(values) => setCampaignForm({ ...campaignForm, stateNames: values, districtNames: [], cityNames: [], pincodes: [] })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="District Filter"
                                        options={campaignDistricts}
                                        selectedValues={campaignForm.districtNames}
                                        onChange={(values) => setCampaignForm({ ...campaignForm, districtNames: values, cityNames: [], pincodes: [] })}
                                        disabled={!campaignForm.stateNames || campaignForm.stateNames.length === 0}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="City Filter"
                                        options={campaignCities}
                                        selectedValues={campaignForm.cityNames}
                                        onChange={(values) => setCampaignForm({ ...campaignForm, cityNames: values, pincodes: [] })}
                                        disabled={!campaignForm.districtNames || campaignForm.districtNames.length === 0}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <MultiSelectDropdown
                                        label="Pincode Filter"
                                        options={campaignPincodes}
                                        selectedValues={campaignForm.pincodes}
                                        onChange={(values) => setCampaignForm({ ...campaignForm, pincodes: values })}
                                        disabled={!campaignForm.cityNames || campaignForm.cityNames.length === 0}
                                    />
                                </div>
                                <div>
                                    <MultiSelectDropdown
                                        label="Block Status Filter"
                                        options={blockStatusOptions}
                                        selectedValues={campaignForm.blockStatuses}
                                        onChange={(values) => setCampaignForm({ ...campaignForm, blockStatuses: values })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                    {/* User Count Badge */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-blue-700">
                                {(() => {
                                    const count = activeTab === "manual" ? manualUserCount : activeTab === "scheduled" ? scheduledUserCount : campaignUserCount;
                                    if (count === null) return "Calculating target users...";
                                    return `${count.toLocaleString()} user${count !== 1 ? 's' : ''} will receive this notification`;
                                })()}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4">
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
        </div>
    );
};

export default CreateNotificationModal;