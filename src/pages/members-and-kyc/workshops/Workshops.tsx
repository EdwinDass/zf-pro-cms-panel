import React, { useState } from "react";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import BlockIcon from "@mui/icons-material/Block";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CancelIcon from "@mui/icons-material/Cancel";
import DescriptionIcon from "@mui/icons-material/Description";
import GridOnIcon from "@mui/icons-material/GridOn";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import MessageIcon from "@mui/icons-material/Message";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KycModal from "../../../components/KycModal";

interface Mechanic {
    id: string;
    name: string;
    initials: string;
    phone: string;
    email: string;
    region: string;
    kycStatus: "Pending" | "Approved";
    joined: string;
    color: string;
    scanBlocked?: boolean;
}

const WorkshopsScreen: React.FC = () => {
    const [openKycDropdown, setOpenKycDropdown] = useState<string | null>(null);
    const [openBlockDropdown, setOpenBlockDropdown] = useState<string | null>(null);
    const [openMoreDropdown, setOpenMoreDropdown] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [kycModalOpen, setKycModalOpen] = useState(false);
    const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

    const mechanics: Mechanic[] = [
        {
            id: "ELE-2847",
            name: "Ramesh Kumar",
            initials: "RK",
            phone: "9876543210",
            email: "ramesh.k@email.com",
            region: "North Delhi",
            kycStatus: "Pending",
            joined: "Oct 24, 2023",
            color: "bg-blue-400",
        },
        {
            id: "ELE-2846",
            name: "Suresh Patel",
            initials: "SP",
            phone: "9876543209",
            email: "suresh.p@email.com",
            region: "West Mumbai",
            kycStatus: "Approved",
            joined: "Oct 15, 2023",
            color: "bg-green-400",
        },
        {
            id: "ELE-2845",
            name: "Mahesh Jain",
            initials: "MJ",
            phone: "9876543208",
            email: "mahesh.j@email.com",
            region: "East Kolkata",
            kycStatus: "Approved",
            joined: "Sep 28, 2023",
            color: "bg-red-300",
            scanBlocked: true,
        },
    ];

    const pageSize = 3;
    const totalPages = Math.ceil(mechanics.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentMechanics = mechanics.slice(startIndex, endIndex);

    const toggleDropdown = (id: string, type: "kyc" | "block" | "more") => {
        if (type === "kyc") {
            setOpenKycDropdown(openKycDropdown === id ? null : id);
            setOpenBlockDropdown(null);
            setOpenMoreDropdown(null);
        } else if (type === "block") {
            setOpenBlockDropdown(openBlockDropdown === id ? null : id);
            setOpenKycDropdown(null);
            setOpenMoreDropdown(null);
        } else {
            setOpenMoreDropdown(openMoreDropdown === id ? null : id);
            setOpenKycDropdown(null);
            setOpenBlockDropdown(null);
        }
    };

    const handleViewDocuments = (mechanic: Mechanic) => {
        setSelectedMechanic(mechanic);
        setKycModalOpen(true);
        setOpenKycDropdown(null);
    };

    return (
        <div className="p-6 min-h-screen">

            {/* DASHBOARD CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

                {/* Total Workshops */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Total Workshops</p>
                            <p className="text-3xl font-bold text-gray-900">856</p>
                            <p className="text-sm text-green-600 mt-2">
                                <span className="font-semibold">+23</span> this month
                            </p>
                        </div>
                        <Inventory2Icon className="text-purple-500" />
                    </div>
                </div>

                {/* KYC Pending */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">KYC Pending</p>
                            <p className="text-3xl font-bold text-gray-900">15</p>
                            <p className="text-sm text-orange-600 mt-2">
                                <span className="font-semibold">+3</span> today
                            </p>
                        </div>
                        <AccessTimeIcon className="text-orange-500" />
                    </div>
                </div>

                {/* KYC Approved */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">KYC Approved</p>
                            <p className="text-3xl font-bold text-gray-900">831</p>
                            <p className="text-sm text-green-600 mt-2">
                                <span className="font-semibold">97.1%</span> approval rate
                            </p>
                        </div>
                        <CheckCircleIcon className="text-green-600" />
                    </div>
                </div>

                {/* Active Today */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Active Today</p>
                            <p className="text-3xl font-bold text-gray-900">428</p>
                            <p className="text-sm text-blue-600 mt-2">
                                <span className="font-semibold">+8%</span> from yesterday
                            </p>
                        </div>
                        <ShoppingCartIcon className="text-blue-600" />
                    </div>
                </div>

            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mechanic</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Region</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">KYC Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentMechanics.map((mechanic) => {
                                const getColorHex = (colorClass: string) => {
                                    const colorMap: Record<string, string> = {
                                        'bg-blue-400': '#60a5fa',
                                        'bg-green-400': '#4ade80',
                                        'bg-red-300': '#fca5a5',
                                        'bg-purple-500': '#a855f7',
                                        'bg-orange-500': '#f97316',
                                    };
                                    return colorMap[colorClass] || '#60a5fa';
                                };

                                return (
                                    <tr
                                        key={mechanic.id}
                                        className="hover:bg-gray-50 transition border-l-4"
                                        style={{ borderLeftColor: getColorHex(mechanic.color) }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-12 h-12 rounded-full ${mechanic.color} flex justify-center items-center text-white font-semibold text-lg`}
                                                >
                                                    {mechanic.initials}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{mechanic.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {mechanic.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{mechanic.phone}</div>
                                            <div className="text-sm text-gray-500">{mechanic.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{mechanic.region}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-3 py-1 rounded-md text-sm font-medium ${mechanic.kycStatus === "Pending"
                                                            ? "bg-orange-100 text-orange-600"
                                                            : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {mechanic.kycStatus}
                                                </span>
                                                {mechanic.scanBlocked && (
                                                    <span className="text-xs text-red-500 font-medium">Scan Blocked</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{mechanic.joined}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">

                                                {/* KYC Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleDropdown(mechanic.id, "kyc")}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                                                    >
                                                        <PersonIcon fontSize="small" />
                                                        KYC
                                                        <KeyboardArrowDownIcon fontSize="small" />
                                                    </button>
                                                    {openKycDropdown === mechanic.id && (
                                                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                                                            {mechanic.kycStatus === "Pending" ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-green-600 font-medium"
                                                                    >
                                                                        <CheckCircleIcon fontSize="small" />
                                                                        Approve KYC
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-red-600 font-medium"
                                                                    >
                                                                        <CancelIcon fontSize="small" />
                                                                        Reject KYC
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleViewDocuments(mechanic)}
                                                                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium border-t border-gray-100"
                                                                    >
                                                                        <DescriptionIcon fontSize="small" />
                                                                        View Documents
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleViewDocuments(mechanic)}
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                >
                                                                    <DescriptionIcon fontSize="small" />
                                                                    View Documents
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Block Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleDropdown(mechanic.id, "block")}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                                                    >
                                                        <BlockIcon fontSize="small" />
                                                        {mechanic.scanBlocked ? "Unblock" : "Block"}
                                                        <KeyboardArrowDownIcon fontSize="small" />
                                                    </button>
                                                    {openBlockDropdown === mechanic.id && (
                                                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                                                            {mechanic.scanBlocked ? (
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
                                                </div>

                                                {/* More Dropdown */}
                                                {mechanic.kycStatus === "Approved" && (
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDropdown(mechanic.id, "more")}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                                                        >
                                                            <MoreHorizIcon fontSize="small" />
                                                            More
                                                            <KeyboardArrowDownIcon fontSize="small" />
                                                        </button>
                                                        {openMoreDropdown === mechanic.id && (
                                                            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                                                                <button
                                                                    type="button"
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                    View Details
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                    Edit Member
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                                                >
                                                                    <MessageIcon fontSize="small" />
                                                                    Send Message
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, mechanics.length)} of{" "}
                        {mechanics.length} mechanics
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
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                type="button"
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${currentPage === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
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
            <KycModal
                isOpen={kycModalOpen}
                onClose={() => setKycModalOpen(false)}
                mechanicName={selectedMechanic?.name || ""}
                mechanicId={selectedMechanic?.id || ""}
            />

        </div>
    );
};

export default WorkshopsScreen;