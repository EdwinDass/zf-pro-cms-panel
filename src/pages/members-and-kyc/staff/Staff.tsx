import React, { useState, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable, { Column } from "../../../components/CustomTable";
import { getUserCount, getUserList, getUserRoles, activateUser, deactivateUser, editUser } from "../../../services/ApiService";
import { toast } from "react-toastify";

interface Role {
    roleId: number;
    roleName: string;
    roleDescription: string;
    createdAt: string;
    isActive: boolean;
}

interface User {
    userId: number;
    userName: string;
    displayName: string;
    userEmail: string;
    userMobile: string;
    blockStatus: string;
    createdAt: string;
    mechanicId: number | null;
    workshopName: string | null;
    gender: string | null;
    tier: string | null;
    adminId: number | null;
    department: string | null;
    userRole: string;
    lastLoginAt: string | null;
    lastLogoutAt: string | null;
    status: string;
}

const Staff: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [activeUsers, setActiveUsers] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editDisplayName, setEditDisplayName] = useState<string>("");
    const [editWorkshopName, setEditWorkshopName] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const pageSize = 10;

    useEffect(() => {
        fetchRoles();
        fetchUserCounts();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, roleFilter, statusFilter]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, roleFilter, statusFilter]);


    const fetchRoles = async () => {
        try {
            const response = await getUserRoles();
            if (response.data && response.data.data) {
                setRoles(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchUserCounts = async () => {
        try {
            // Total users
            const totalParams = new URLSearchParams();
            [2, 3, 4, 5, 6].forEach(roleId => totalParams.append("role", String(roleId)));
            const totalResponse = await getUserCount(totalParams.toString());
            if (totalResponse.data && totalResponse.data.count !== undefined) {
                setTotalUsers(totalResponse.data.count);
            }

            // Active users
            const activeParams = new URLSearchParams();
            activeParams.append("status", "none");
            [2, 3, 4, 5, 6].forEach(roleId => activeParams.append("role", String(roleId)));
            const activeResponse = await getUserCount(activeParams.toString());
            if (activeResponse.data && activeResponse.data.count !== undefined) {
                setActiveUsers(activeResponse.data.count);
            }
        } catch (error) {
            console.error("Error fetching user counts:", error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const filters: any = {
                page: page,
                limit: pageSize,
                role: [2, 3, 4, 5, 6],
            };

            if (searchTerm.length >= 3) {
                filters.search = searchTerm;
            }
            if (statusFilter) filters.status = statusFilter;
            if (roleFilter) {
                const selectedRole = roles.find(r => r.roleName === roleFilter);
                if (selectedRole) filters.role = [selectedRole.roleId];
            }

            const response = await getUserList(filters);

            setUsers(response.data.data || []);
            setTotalCount(response.data.totalRecords || 0);

        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleActivateDeactivate = async (userId: number, currentStatus: string) => {
        try {
            if (currentStatus === "inactive" || currentStatus === "de-activated") {
                const response = await activateUser(userId);
                toast.success(response.data.message || "User activated successfully");
            } else {
                const response = await deactivateUser(userId);
                toast.success(response.data.message || "User deactivated successfully");
            }
            fetchUsers();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update user status");
            console.error("Error updating user status:", error);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setEditDisplayName(user.displayName || "");
        setEditWorkshopName(user.workshopName || "");
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
        setEditDisplayName("");
        setEditWorkshopName("");
    };

    const handleEditSubmit = async () => {
        if (!editingUser) return;

        setIsSubmitting(true);
        try {
            const payload: any = {
                displayName: editDisplayName,
            };

            // Only include workshopName if the user is a mechanic
            if (editingUser.userRole.toLowerCase() === "mechanic") {
                payload.workshopName = editWorkshopName;
            }

            const response = await editUser(editingUser.userId, payload);
            toast.success(response.data.message || "User updated successfully");
            handleCloseEditModal();
            fetchUsers();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update user");
            console.error("Error updating user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const getAvatarColor = (index: number): string => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-pink-500",
        ];
        return colors[index % colors.length];
    };

    const getBadgeColor = (role: string): string => {
        const colorMap: Record<string, string> = {
            admin: "bg-blue-100 text-blue-600",
            manager: "bg-green-100 text-green-600",
            operator: "bg-orange-100 text-orange-600",
            viewer: "bg-gray-100 text-gray-600",
            mechanic: "bg-purple-100 text-purple-600",
            call_centre_executive: "bg-yellow-100 text-yellow-600",
        };
        return colorMap[role.toLowerCase()] || "bg-gray-100 text-gray-600";
    };

    const getStatusIndicator = (status: string): string => {
        const colorMap: Record<string, string> = {
            none: "bg-green-500",
            digilocker: "bg-blue-500",
            kyc: "bg-purple-500",
            "incomplete-registration": "bg-yellow-500",
            "kyc-admin": "bg-indigo-500",
            login: "bg-teal-500",
            scan: "bg-cyan-500",
            redeem: "bg-lime-500",
            inactive: "bg-red-500",
            dormant: "bg-gray-500",
            "de-activated": "bg-red-700",
        };
        return colorMap[status.toLowerCase()] || "bg-gray-500";
    };

    const getStatusText = (status: string): string => {
        const colorMap: Record<string, string> = {
            none: "text-green-600",
            digilocker: "text-blue-600",
            kyc: "text-purple-600",
            "incomplete-registration": "text-yellow-600",
            "kyc-admin": "text-indigo-600",
            login: "text-teal-600",
            scan: "text-cyan-600",
            redeem: "text-lime-600",
            inactive: "text-red-600",
            dormant: "text-gray-600",
            "de-activated": "text-red-700",
        };
        return colorMap[status.toLowerCase()] || "text-gray-600";
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const columns: Column[] = [
        {
            key: "user",
            label: "User",
            render: (user: User) => (
                <div className="flex items-center">
                    <div
                        className={`w-10 h-10 rounded-full ${getAvatarColor(
                            user.userId
                        )} flex justify-center items-center text-white font-semibold`}
                    >
                        {getInitials(user.userName)}
                    </div>
                    <div className="ml-3">
                        <div className="font-medium text-gray-900">{user.userName}</div>
                    </div>
                </div>
            ),
        },
        {
            key: "email",
            label: "Email",
            render: (user: User) => user.userEmail,
        },
        {
            key: "mobile",
            label: "Mobile",
            render: (user: User) => user.userMobile || "N/A",
        },
        {
            key: "displayName",
            label: "Display Name",
            render: (user: User) => user.displayName || "N/A",
        },
        {
            key: "role",
            label: "Role",
            render: (user: User) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                        user.userRole
                    )}`}
                >
                    {user.userRole.replace(/_/g, " ")}
                </span>
            ),
        },
        {
            key: "department",
            label: "Department",
            render: (user: User) => user.department || user.workshopName || "N/A",
        },
        {
            key: "tier",
            label: "Tier",
            render: (user: User) => user.tier || "N/A",
        },
        {
            key: "lastLogin",
            label: "Last Login",
            render: (user: User) => formatDate(user.lastLoginAt),
        },
        {
            key: "status",
            label: "Status",
            render: (user: User) => (
                <div className="flex items-center">
                    <span
                        className={`w-2 h-2 rounded-full ${getStatusIndicator(
                            user.status
                        )} mr-2`}
                    />
                    <span className={`capitalize ${getStatusText(user.status)}`}>
                        {user.status}
                    </span>
                </div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (user: User) => (
                <div className="flex items-center space-x-4">
                    <button
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        onClick={() => handleEditClick(user)}
                    >
                        <EditIcon fontSize="small" className="mr-1" /> Edit
                    </button>
                    <button
                        className={`flex items-center ${user.status === "inactive" || user.status === "de-activated"
                            ? "text-green-600 hover:text-green-900"
                            : "text-red-600 hover:text-red-900"
                            }`}
                        onClick={() => handleActivateDeactivate(user.userId, user.status)}
                    >
                        {user.status === "inactive" || user.status === "de-activated" ? (
                            <>
                                <ToggleOnIcon fontSize="small" className="mr-1" /> Activate
                            </>
                        ) : (
                            <>
                                <ToggleOffIcon fontSize="small" className="mr-1" /> Deactivate
                            </>
                        )}
                    </button>
                </div>
            ),
        },
    ];

    const activeRate =
        totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    return (
        <div>
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Staff</h4>
                        <GroupsIcon className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{totalUsers}</p>
                    {/* <div className="flex items-center text-sm">
                        <span className="text-green-600">+12</span>
                        <span className="text-gray-600 ml-2">this month</span>
                    </div> */}
                </div>
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Active Staff</h4>
                        <PersonAddAlt1Icon className="text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{activeUsers}</p>
                    {/* <div className="flex items-center text-sm">
                        <span className="text-green-600">{activeRate}%</span>
                        <span className="text-gray-600 ml-2">active rate</span>
                    </div> */}
                </div>
            </div>
            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100 transition-transform transform hover:scale-[1.01] hover:shadow-lg">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Search users (min 3 characters)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label
                            htmlFor="roleFilter"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>
                        <select
                            id="roleFilter"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            {roles
                                .filter((role) => role.roleName !== "mechanic")
                                .map((role) => (
                                    <option key={role.roleId} value={role.roleName}>
                                        {role.roleName.replace(/_/g, " ")}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label
                            htmlFor="statusFilter"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>
                        <select
                            id="statusFilter"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="none">None</option>
                            <option value="digilocker">Digilocker</option>
                            <option value="kyc">KYC</option>
                            <option value="incomplete-registration">Incomplete Registration</option>
                            <option value="kyc-admin">KYC Admin</option>
                            <option value="login">Login</option>
                            <option value="scan">Scan</option>
                            <option value="redeem">Redeem</option>
                            <option value="inactive">Inactive</option>
                            <option value="dormant">Dormant</option>
                            <option value="de-activated">De-activated</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-600">Loading users...</div>
                </div>
            ) : (
                <CustomTable
                    columns={columns}
                    data={users}
                    pageSize={pageSize}
                    totalRows={totalCount}
                    currentPage={page}
                    onPageChange={onPageChange}
                />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingUser && (
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

                            {editingUser.userRole.toLowerCase() === "mechanic" && (
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
                            )}

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

export default Staff;