import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PersonIcon from "@mui/icons-material/Person";
import BlockIcon from "@mui/icons-material/Block";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import GridOnIcon from "@mui/icons-material/GridOn";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import MessageIcon from "@mui/icons-material/Message";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { getUserKycsByUserId, getUserCount, getKycStatus as apiGetKycStatus, getUserList, editUser, getUserProfile, updateMechanicPreferredRetailer, searchWorkshops } from "../../../services/ApiService";
import { toast } from "react-toastify";
import KycModal from "../../../components/KycModal";
import { UserDetails } from "../../../types/User";

interface KycDocument {
    detailId: number;
    kycType: string;
    kycDoc: string;
    docStatus: "Pending" | "Approved" | "Rejected";
    kycCreatedAt: string;
    kycUpdatedAt: string | null;
    comment: string | null;
}

interface Mechanic {
    userId: number;
    userName: string;
    displayName?: string;
    userEmail: string;
    userMobile: string;
    userRole: number;
    blockStatus: string;
    userCreatedAt: string;
    kycApproval: boolean;
    kycDocuments: KycDocument[];
    preferredRetailerList?: {
        retailerId: number;
        mobile: string;
        name: string;
        pincode: number;
    }[];
    workshopName?: string | null;
    color: string;
    initials: string;
}

interface User {
    userId: number;
    userName: string;
    displayName?: string;
    userRole: string;
}

// ─── Preferred Retailer Modal ───────────────────────────────────────────────────

interface WorkshopOption {
    retailerId: number;
    storeName: string;
    retailerName: string;
    mobileNumber: string;
    currentPincode: number | null;
}

const PreferredRetailerModal: React.FC<{
    mechanic: Mechanic;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ mechanic, onClose, onSuccess }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [allWorkshops, setAllWorkshops] = useState<WorkshopOption[]>([]);
    const [loadingWorkshops, setLoadingWorkshops] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(
        mechanic.preferredRetailerList?.[0]?.retailerId ?? null
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Fetch all workshops once when dropdown opens for the first time
    const openDropdown = async () => {
        setDropdownOpen(true);
        if (allWorkshops.length > 0) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
            return;
        }
        setLoadingWorkshops(true);
        try {
            const res = await searchWorkshops("");
            setAllWorkshops(res?.data?.data || []);
        } catch {
            toast.error("Failed to load workshops");
        } finally {
            setLoadingWorkshops(false);
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    };

    // Filter in-memory as the user types
    const filtered = searchTerm.trim()
        ? allWorkshops.filter(w =>
            w.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.retailerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.mobileNumber.includes(searchTerm)
        )
        : allWorkshops;

    // Close dropdown on outside click
    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateMechanicPreferredRetailer(mechanic.userId, selectedId);
            toast.success(selectedId ? "Preferred workshop updated successfully" : "Preferred workshop cleared");
            onSuccess();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update preferred workshop");
        } finally {
            setSaving(false);
        }
    };

    const selectedWorkshop =
        allWorkshops.find(w => w.retailerId === selectedId) ??
        (mechanic.preferredRetailerList?.[0]?.retailerId === selectedId && selectedId !== null
            ? { storeName: mechanic.preferredRetailerList![0].name, retailerName: "", mobileNumber: "", currentPincode: null, retailerId: selectedId }
            : null);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style={{ minHeight: "75vh", maxHeight: "95vh" }}>

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                            <EditIcon className="text-white" fontSize="small" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-base leading-tight">Edit Preferred Workshop</h2>
                            <p className="text-indigo-200 text-xs mt-0.5">
                                {mechanic.displayName || mechanic.userName} &bull; ID {mechanic.userId}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-indigo-200 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:bg-opacity-10">
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1">

                    {/* Selected workshop banner */}
                    {selectedId !== null && selectedWorkshop && (
                        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-0.5">
                                    {mechanic.preferredRetailerList?.[0]?.retailerId === selectedId ? "Current Workshop" : "Selected Workshop"}
                                </p>
                                <p className="text-sm font-semibold text-indigo-800 truncate">{selectedWorkshop.storeName}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedId(null)}
                                className="text-xs text-red-400 hover:text-red-600 font-medium transition shrink-0 px-2 py-1 rounded-lg hover:bg-red-50"
                            >
                                Remove
                            </button>
                        </div>
                    )}

                    {/* Searchable dropdown */}
                    <div ref={dropdownRef}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Search &amp; Select Workshop
                        </label>
                        <div className="relative">
                            {/* Trigger */}
                            <div
                                onClick={openDropdown}
                                className={`flex items-center gap-2 border rounded-xl px-3.5 py-3 bg-white cursor-pointer transition select-none ${
                                    dropdownOpen ? "border-indigo-400 ring-2 ring-indigo-100" : "border-gray-200 hover:border-indigo-300"
                                }`}
                            >
                                {dropdownOpen ? (
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        onClick={e => e.stopPropagation()}
                                        placeholder="Search by name, owner or mobile..."
                                        className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                                    />
                                ) : (
                                    <span className="flex-1 text-sm text-gray-400">
                                        {selectedId === null ? "Click to select a workshop..." : "Click to change workshop..."}
                                    </span>
                                )}
                                <div className="shrink-0 flex items-center gap-1.5 ml-1">
                                    {loadingWorkshops && (
                                        <svg className="animate-spin h-4 w-4 text-indigo-500" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                    )}
                                    <svg
                                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Dropdown panel */}
                            {dropdownOpen && (
                                <div className="absolute z-30 w-full bg-white border border-gray-200 rounded-xl mt-1.5 shadow-xl overflow-hidden">
                                    {!loadingWorkshops && (
                                        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                {filtered.length} workshop{filtered.length !== 1 ? "s" : ""}{searchTerm ? " match" : " available"}
                                            </span>
                                            {searchTerm && (
                                                <button
                                                    type="button"
                                                    onClick={e => { e.stopPropagation(); setSearchTerm(""); }}
                                                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                                                >
                                                    Clear filter
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <div className="max-h-96 overflow-y-auto">
                                        {loadingWorkshops ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                                <svg className="animate-spin h-6 w-6 text-indigo-400 mb-2" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                <span className="text-sm">Loading workshops...</span>
                                            </div>
                                        ) : filtered.length > 0 ? (
                                            filtered.map(w => {
                                                const isSelected = selectedId === w.retailerId;
                                                return (
                                                    <div
                                                        key={w.retailerId}
                                                        onClick={() => {
                                                            setSelectedId(isSelected ? null : w.retailerId);
                                                            setSearchTerm("");
                                                            setDropdownOpen(false);
                                                        }}
                                                        className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-b border-gray-50 last:border-0 ${
                                                            isSelected ? "bg-indigo-50 hover:bg-indigo-100" : "hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                            isSelected ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                                                        }`}>
                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-semibold truncate leading-snug ${isSelected ? "text-indigo-800" : "text-gray-800"}`}>
                                                                {w.storeName}
                                                            </p>
                                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                                {w.retailerName} &bull; {w.mobileNumber}
                                                                {w.currentPincode ? ` \u2022 PIN ${w.currentPincode}` : ""}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            {isSelected && (
                                                                <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded-md font-semibold">&#10003;</span>
                                                            )}
                                                            <span className="text-xs text-gray-300 font-mono">#{w.retailerId}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="py-10 text-center text-gray-400">
                                                <p className="text-sm font-medium">No workshops found</p>
                                                {searchTerm && <p className="text-xs mt-1">Try a different search term</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-sm disabled:opacity-50 shadow-sm"
                    >
                        {saving ? (
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        ) : null}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};


// ─── MechanicsScreen ────────────────────────────────────────────────────────────

const MechanicsScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openKycDropdown, setOpenKycDropdown] = useState<number | null>(null);
    const [openBlockDropdown, setOpenBlockDropdown] = useState<number | null>(null);
    const [openMoreDropdown, setOpenMoreDropdown] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [kycModalOpen, setKycModalOpen] = useState(false);
    const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalMechanics, setTotalMechanics] = useState("0");
    const [kycCounts, setKycCounts] = useState({ approved: "0", pending: "0", percentage: "0" });
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null);
    const [editDisplayName, setEditDisplayName] = useState<string>("");
    const [editWorkshopName, setEditWorkshopName] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loggedUserDetails, setLoggedUserDetails] = useState<UserDetails | null>(null)
    const userDropdownRef = useRef<HTMLDivElement>(null);

    // ── Preferred Retailer Modal state ────────────────────────────────────────
    const [preferredRetailerMechanic, setPreferredRetailerMechanic] = useState<Mechanic | null>(null);

    const pageSize = 10;

    const getInitials = (name: string): string => {
        if (!name || name === "unknown") return "UK";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getColor = (index: number): string => {
        const colors = ["bg-blue-400", "bg-green-400", "bg-red-300", "bg-purple-500", "bg-orange-500"];
        return colors[index % colors.length];
    };

    const fetchMechanics = async () => {
        setLoading(true);
        try {
            const userIdParam = Number(selectedUserId) || 0;
            const searchActive = searchTerm.length >= 3;
            const fetchPage = searchActive ? 1 : currentPage;
            const fetchSize = searchActive ? 1000 : pageSize;
            const response = await getUserKycsByUserId(userIdParam, fetchPage, fetchSize);

            if (response.data.success) {
                // Fix: Handle both array (all users) and single object (specific user) responses
                let rawData = response.data.data;
                if (!Array.isArray(rawData)) {
                    rawData = [rawData];
                }

                const mappedData: Mechanic[] = rawData.map((item: any, index: number) => ({
                    userId: item.userId,
                    userName: item.userName,
                    displayName: item.displayName,
                    userEmail: item.userEmail,
                    userMobile: item.userMobile,
                    userRole: item.userRole,
                    blockStatus: item.blockStatus,
                    userCreatedAt: item.userCreatedAt,
                    kycApproval: item.kycApproval,
                    kycDocuments: item.kycDocuments || [],
                    preferredRetailerList: item.preferredRetailerList || [],
                    workshopName: item.workshop,
                    initials: getInitials(item.userName),
                    color: getColor(index),
                }));

                setMechanics(mappedData);
                setTotalRecords(response.data.totalRecords);
            }
        } catch (error) {
            console.error("Error fetching mechanics:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getUserList({
                page: 1,
                limit: 500,
                role: [1],
            });
            const list = response?.data?.data || [];

            const filtered = list.filter(
                (u: any) => u.userRole?.toLowerCase() === "mechanic"
            );

            setUsers(filtered.map((u: any) => ({
                userId: u.userId,
                userName: u.userName,
                displayName: u.displayName,
                userRole: u.userRole,
            })) as User[]);
        } catch (err) {
            console.error("User list fetch failed:", err);
        }
    };

    useEffect(() => {
        fetchMechanics();
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchMechanics();
    }, [selectedUserId, searchTerm]);

    useEffect(() => {
        fetchTotalMechanics();
        fetchKycCounts();
        fetchUsers();
        userProfile();
    }, []);

    const userProfile = async () => {
        try {
            const res = await getUserProfile();
            setLoggedUserDetails(res?.data?.data);
            console.log("dacwvwrgr", res?.data?.data)
        } catch (error) {

        }
    }

    const fetchTotalMechanics = async () => {
        try {
            const roleIds = [1];
            const params = new URLSearchParams();
            roleIds.forEach(r => params.append("role", String(r)));

            const response = await getUserCount(params.toString());
            const count = response?.data?.count ?? response?.data?.data?.count ?? 0;
            setTotalMechanics(String(count || 0));
        } catch (error) {
            console.error("Error fetching total mechanics:", error);
        }
    };

    const fetchKycCounts = async () => {
        try {
            const response = await apiGetKycStatus({});

            const approved = Number(response?.data?.data?.approved) || 0;
            const pending = Number(response?.data?.data?.pending) || 0;
            const total = approved + pending || 1;
            const percentage = ((approved / total) * 100).toFixed(2);

            setKycCounts({
                approved: approved.toString(),
                pending: pending.toString(),
                percentage: percentage
            });
        } catch (error) {
            console.error("Error fetching KYC counts:", error);
        }
    };

    const filteredMechanics = useMemo(() => {
        if (!searchTerm || searchTerm.length < 3) return mechanics;
        const lowerSearch = searchTerm.toLowerCase();
        return mechanics.filter(m =>
            m.userName.toLowerCase().includes(lowerSearch) ||
            m.userEmail.toLowerCase().includes(lowerSearch) ||
            m.userMobile.includes(searchTerm)
        );
    }, [mechanics, searchTerm]);

    const displayedMechanics = useMemo(() => {
        const searchActive = searchTerm.length >= 3;
        if (!searchActive) {
            return mechanics;
        }
        const start = (currentPage - 1) * pageSize;
        return filteredMechanics.slice(start, start + pageSize);
    }, [mechanics, filteredMechanics, currentPage, searchTerm, pageSize]);

    const effectiveTotal = useMemo(() => {
        const searchActive = searchTerm.length >= 3;
        return searchActive ? filteredMechanics.length : totalRecords;
    }, [searchTerm, filteredMechanics.length, totalRecords]);

    const totalPages = Math.ceil(effectiveTotal / pageSize);

    const toggleDropdown = useCallback((userId: number, type: "kyc" | "block" | "more") => {
        if (type === "kyc") {
            setOpenKycDropdown(prev => prev === userId ? null : userId);
            setOpenBlockDropdown(null);
            setOpenMoreDropdown(null);
        } else if (type === "block") {
            setOpenBlockDropdown(prev => prev === userId ? null : userId);
            setOpenKycDropdown(null);
            setOpenMoreDropdown(null);
        } else {
            setOpenMoreDropdown(prev => prev === userId ? null : userId);
            setOpenKycDropdown(null);
            setOpenBlockDropdown(null);
        }
    }, []);

    const handleViewDocuments = useCallback((mechanic: Mechanic) => {
        setSelectedMechanic(mechanic);
        setKycModalOpen(true);
        setOpenKycDropdown(null);
    }, []);

    const formatDate = useCallback((dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }, []);

    const hasScanBlocked = useCallback((blockStatus: string): boolean => {
        return blockStatus === "scan" || blockStatus === "blocked";
    }, []);

    const getColorHex = useCallback((colorClass: string) => {
        const colorMap: Record<string, string> = {
            'bg-blue-400': '#60a5fa',
            'bg-green-400': '#4ade80',
            'bg-red-300': '#fca5a5',
            'bg-purple-500': '#a855f7',
            'bg-orange-500': '#f97316',
        };
        return colorMap[colorClass] || '#60a5fa';
    }, []);

    const handleEditClick = (mechanic: Mechanic) => {
        setEditingMechanic(mechanic);
        setEditDisplayName(mechanic.displayName || "");
        setEditWorkshopName(mechanic.workshopName || "");
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingMechanic(null);
        setEditDisplayName("");
        setEditWorkshopName("");
    };

    const handleEditSubmit = async () => {
        if (!editingMechanic) return;

        setIsSubmitting(true);
        try {
            const payload: any = {
                displayName: editDisplayName,
                workshopName: editWorkshopName,
            };

            const response = await editUser(editingMechanic.userId, payload);
            toast.success(response.data.message || "User updated successfully");
            handleCloseEditModal();
            fetchMechanics();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update user");
            console.error("Error updating user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedUser = users.find((u) => u.userId.toString() === selectedUserId);
    const displayName = selectedUser ? (selectedUser.displayName || selectedUser.userName) : "All Mechanics";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="p-0 min-h-screen">
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Total Mechanics</p>
                            <p className="text-3xl font-bold text-gray-900">{totalMechanics}</p>
                            <p className="text-sm text-green-600 mt-2">
                                {/* <span className="font-semibold">+47</span> this month */}
                            </p>
                        </div>
                        <GroupsIcon className="text-gray-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">KYC Pending</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {kycCounts.pending}
                            </p>
                            <p className="text-sm text-orange-600 mt-2">
                                {/* <span className="font-semibold">+5</span> today */}
                            </p>
                        </div>
                        <PersonAddAlt1Icon className="text-orange-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">KYC Approved</p>
                            <p className="text-3xl font-bold text-gray-900">{kycCounts.approved}</p>
                            <p className="text-sm text-green-600 mt-2">
                                <span className="font-semibold">{kycCounts.percentage}%</span> approval rate
                            </p>
                        </div>
                        <CheckCircleIcon className="text-green-600" />
                    </div>
                </div>

                {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Active Today</p>
                            <p className="text-3xl font-bold text-gray-900">342</p>
                            <p className="text-sm text-blue-600 mt-2">
                                <span className="font-semibold">+12%</span> from yesterday
                            </p>
                        </div>
                        <FlashOnIcon className="text-yellow-500" />
                    </div>
                </div> */}
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200">
                <div className="p-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[300px]">
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Search mechanics by name, email or mobile..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="min-w-[180px]" ref={userDropdownRef}>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={displayName}
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer pr-10"
                                    placeholder="All Mechanics"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {isUserDropdownOpen && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                                        <div
                                            onClick={() => {
                                                setSelectedUserId("");
                                                setIsUserDropdownOpen(false);
                                            }}
                                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                        >
                                            All Mechanics
                                        </div>
                                        {users.map((u) => (
                                            <div
                                                key={u.userId}
                                                onClick={() => {
                                                    setSelectedUserId(u.userId.toString());
                                                    setIsUserDropdownOpen(false);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                {u.displayName || u.userName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Mechanic
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    KYC Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : displayedMechanics.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No mechanics found
                                    </td>
                                </tr>
                            ) : (
                                displayedMechanics.map((mechanic) => {
                                    const kycStatus = mechanic.kycApproval ? "Approved" : "Pending";
                                    const scanBlocked = hasScanBlocked(mechanic.blockStatus);

                                    return (
                                        <tr key={mechanic.userId} className="hover:bg-gray-50 transition border-l-4" style={{ borderLeftColor: getColorHex(mechanic.color) }}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-12 h-12 rounded-full ${mechanic.color} flex justify-center items-center text-white font-semibold text-lg`}
                                                    >
                                                        {mechanic.initials}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            {mechanic.displayName || mechanic.userName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {mechanic.workshopName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {mechanic.userId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{mechanic.userMobile}</div>
                                                <div className="text-sm text-gray-500">{mechanic.userEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{mechanic.userRole}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-md text-sm font-medium ${kycStatus === "Pending"
                                                            ? "bg-orange-100 text-orange-600"
                                                            : "bg-green-100 text-green-600"
                                                            }`}
                                                    >
                                                        {kycStatus}
                                                    </span>
                                                    {scanBlocked && (
                                                        <span className="text-xs text-red-500 font-medium">
                                                            Scan Blocked
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{formatDate(mechanic.userCreatedAt)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* KYC Dropdown */}
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDropdown(mechanic.userId, "kyc")}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                                                        >
                                                            <PersonIcon fontSize="small" />
                                                            KYC
                                                            <KeyboardArrowDownIcon fontSize="small" />
                                                        </button>
                                                        {openKycDropdown === mechanic.userId && (
                                                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleViewDocuments(mechanic)}
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                    View Documents
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Edit Workshop */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreferredRetailerMechanic(mechanic)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-medium text-indigo-700 transition"
                                                        title="Edit Workshop"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                        Edit
                                                    </button>

                                                    {/* Block Dropdown */}
                                                    {/* <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDropdown(mechanic.userId, "block")}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                                                        >
                                                            <BlockIcon fontSize="small" />
                                                            {scanBlocked ? "Unblock" : "Block"}
                                                            <KeyboardArrowDownIcon fontSize="small" />
                                                        </button>
                                                        {openBlockDropdown === mechanic.userId && (
                                                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                                                                {scanBlocked ? (
                                                                    <button
                                                                        type="button"
                                                                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                    >
                                                                        <LockOpenIcon fontSize="small" />
                                                                        Unblock Account
                                                                    </button>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-orange-600 font-medium"
                                                                        >
                                                                            <GridOnIcon fontSize="small" />
                                                                            Block Scan
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-orange-600 font-medium"
                                                                        >
                                                                            <CardGiftcardIcon fontSize="small" />
                                                                            Block Redemption
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-red-600 font-medium border-t border-gray-100"
                                                                        >
                                                                            <PersonAddIcon fontSize="small" />
                                                                            Block Account
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div> */}

                                                    {/* More Dropdown */}
                                                    {/* <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDropdown(mechanic.userId, "more")}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                                                        >
                                                            <MoreHorizIcon fontSize="small" />
                                                            More
                                                            <KeyboardArrowDownIcon fontSize="small" />
                                                        </button> */}
                                                    {/* {openMoreDropdown === mechanic.userId && ( */}
                                                    {/* <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]"> */}
                                                    {/* <button
                                                                    type="button"
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                    View Details
                                                                </button> */}
                                                    {/* <button
                                                                    type="button"
                                                                    onClick={() => handleEditClick(mechanic)}
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                    Edit Member
                                                                </button> */}
                                                    {/* <button
                                                                    type="button"
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                >
                                                                    <MessageIcon fontSize="small" />
                                                                    Send Message
                                                                </button> */}
                                                    {/* </div> */}
                                                    {/* )} */}
                                                    {/* </div> */}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, effectiveTotal)} of{" "}
                        {effectiveTotal} mechanics
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    type="button"
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${currentPage === pageNum
                                        ? "bg-blue-600 text-white"
                                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* KYC Modal */}
            {selectedMechanic && (
                <KycModal
                    isOpen={kycModalOpen}
                    onClose={() => {
                        setKycModalOpen(false);
                        fetchMechanics();
                    }}
                    mechanicName={selectedMechanic.userName}
                    mechanicId={selectedMechanic.userId.toString()}
                    kycDocuments={selectedMechanic.kycDocuments}
                    preferredRetailerList={selectedMechanic.preferredRetailerList}
                    loggedUser={loggedUserDetails as UserDetails}
                />
            )}

            {/* Preferred Retailer Modal */}
            {preferredRetailerMechanic && (
                <PreferredRetailerModal
                    mechanic={preferredRetailerMechanic}
                    onClose={() => setPreferredRetailerMechanic(null)}
                    onSuccess={() => { setPreferredRetailerMechanic(null); fetchMechanics(); }}
                />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingMechanic && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
                            <button
                                type="button"
                                onClick={handleCloseEditModal}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Close edit modal"
                            >
                                <CloseIcon />
                            </button>

                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editDisplayName}
                                    onChange={(e) => setEditDisplayName(e.target.value)}
                                    placeholder="Enter display name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Workshop Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editWorkshopName}
                                    onChange={(e) => setEditWorkshopName(e.target.value)}
                                    placeholder="Enter workshop name"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleCloseEditModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MechanicsScreen;