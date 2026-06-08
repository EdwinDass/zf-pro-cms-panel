import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/CustomTable";
import FiltersBar from "./FiltersBar";
import StatsRowOne from "./StatsRowOne";

// API calls
import {
    getTickets,
    getRoles,
    getTicketCategories,
    getTicketStatus,
    resolveTicket,
    assignTicket,
} from "../../../services/ApiService";

// Modals
import ResolveTicket from "./ResolveTicket";
import AssignTicket from "./AssignTicket";
import ViewTicket from "./ViewTicket";

// Icons
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import DoneIcon from "@mui/icons-material/Done";

interface TicketsTableProps {
    defaultStatus?: string;
    showStats?: boolean;
    disableStatusFilter?: boolean;
}

interface Ticket {
    TicketID: number;
    Category: string;
    Description: string;
    Username: string;
    email: string;
    mobile?: string;
    Status: string;
    roleAssigned: string;
    resolvedComments?: string;
    createdAt?: string;
    createdBy?: string;
    imageUrl?: string;
}

interface Category {
    categoryId: number;
    categoryName: string;
}

interface Role {
    roleId: number;
    roleName: string;
}

const labelColors: Record<string, string> = {
    Pending: "bg-red-50 text-red-500",
    Open: "bg-orange-50 text-orange-500",
    Resolved: "bg-green-50 text-green-600",
    Communication: "bg-orange-50 text-orange-600",
    Transactions: "bg-purple-50 text-purple-600",
    "Rewards and Benefits": "bg-blue-50 text-blue-600",
    "Profile Management": "bg-teal-50 text-teal-600",
    "Account Access": "bg-red-50 text-red-600",
    "App Performance": "bg-indigo-50 text-indigo-600",
    "Loyalty points": "bg-pink-50 text-pink-600",
};

const TicketsTable: React.FC<TicketsTableProps> = ({
    defaultStatus,
    showStats = true,
    disableStatusFilter = false,
}) => {

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [resolveModalOpen, setResolveModalOpen] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [assignTicketId, setAssignTicketId] = useState<number | null>(null);
    const [viewTicketData, setViewTicketData] = useState<any | null>(null);

    // 🔥 pagination states
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [totalRows, setTotalRows] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState<any>({
        ticketStatus: defaultStatus || undefined,
    });

    /** INITIAL LOAD */
    useEffect(() => {
        fetchMasterData();
    }, []);

    /** Re-fetch on status parameter change */
    useEffect(() => {
        setPage(1);
        setActiveFilters({
            ticketStatus: defaultStatus || undefined,
        });
    }, [defaultStatus]);

    /** Re-fetch on page change or filter change */
    useEffect(() => {
        fetchTickets();
    }, [page, activeFilters]);

    /** Fetch master data (categories, roles, statuses) */
    const fetchMasterData = async () => {
        fetchCategories();
        fetchRoles();
        fetchStatuses();
    };

    /** Fetch Tickets */
    const fetchTickets = async (customParams?: any) => {
        try {
            const payload = {
                page: page,
                limit: pageSize,
                ...activeFilters,
                ...customParams
            };

            const response = await getTickets(payload);

            const raw = response?.data?.data?.data || [];
            setTotalRows(response?.data?.data?.total || 0);

            const mapped: Ticket[] = raw.map((x: any) => ({
                TicketID: x.ticket?.ticketId || "-",
                Category: x.category?.name || "-",
                Description: x.ticket?.description || "-",
                Username: x.user?.name || "-",
                email: x.user?.email || "-",
                mobile: x.user?.mobile || "-",
                Status: x.ticket?.ticketStatus || "-",
                roleAssigned: x.role?.roleName || "-",
                resolvedComments: x.ticket?.resolvedComments || "-",
                createdAt: x.ticket?.createdAt || "-",
                createdBy: x.ticket?.createdBy || "-",
                imageUrl: x.ticket?.imgUrl || null,
            }));

            setTickets(mapped);

            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                const results = mapped.filter((t) =>
                    t.Description.toLowerCase().includes(lower) ||
                    t.Username.toLowerCase().includes(lower) ||
                    t.email.toLowerCase().includes(lower) ||
                    t.Category.toLowerCase().includes(lower) ||
                    t.Status.toLowerCase().includes(lower) ||
                    t.roleAssigned.toLowerCase().includes(lower)
                );
                setFilteredTickets(results);
            } else {
                setFilteredTickets(mapped);
            }

        } catch (error) {
            console.error("Tickets fetch error:", error);
        }
    };

    const fetchCategories = async () => {
        const response = await getTicketCategories();
        const raw = response?.data?.data || [];
        const mapped = raw.map((x: any) => ({
            categoryId: x.ticketId,
            categoryName: x.ticketCategory,
        }));
        setCategories(mapped);
    };

    const fetchRoles = async () => {
        const response = await getRoles();
        const raw = response?.data?.data || [];
        const mapped = raw.map((x: any) => ({
            roleId: x.roleId,
            roleName: x.roleName,
        }));
        setRoles(mapped);
    };

    const fetchStatuses = async () => {
        const response = await getTicketStatus();
        const raw = response?.data?.data || [];
        setStatuses(raw);
    };

    /** SEARCH */
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const lower = value.toLowerCase();
        const results = tickets.filter((t) =>
            t.Description.toLowerCase().includes(lower) ||
            t.Username.toLowerCase().includes(lower) ||
            t.email.toLowerCase().includes(lower) ||
            t.Category.toLowerCase().includes(lower) ||
            t.Status.toLowerCase().includes(lower) ||
            t.roleAssigned.toLowerCase().includes(lower)
        );

        setFilteredTickets(results);
    };

    /** FILTER HANDLER */
    const handleFilterChange = (filters: any) => {
        const { status, role, category } = filters;

        setPage(1);
        setActiveFilters({
            ticketStatus:
                disableStatusFilter || status === "all" ? defaultStatus : status,
            ticketCategoryId: category !== "all" ? category : undefined,
            roleAssigned: role !== "all" ? role : undefined,
        });
    };

    /** TABLE COLUMNS */
    const columns = [
        { key: "TicketID", label: "Ticket ID" },
        {
            key: "Category",
            label: "Category",
            render: (row: any) => {
                const cls = labelColors[row.Category] || "bg-gray-100 text-gray-600";
                return (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
                        {row.Category}
                    </span>
                );
            },
        },
        { key: "Description", label: "Description" },
        { key: "Username", label: "Username" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
        { key: "roleAssigned", label: "Role Assigned" },
        {
            key: "Status",
            label: "Status",
            render: (row: any) => {
                const cls = labelColors[row.Status] || "bg-gray-100 text-gray-600";
                return (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
                        {row.Status}
                    </span>
                );
            },
        },
        {
            key: "actions",
            label: "Actions",
            render: (u: Ticket) => (
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => {
                            setViewTicketData(u);
                            setViewModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                        <RemoveRedEyeIcon fontSize="small" className="mr-1" /> View
                    </button>

                    {u.Status === "Pending" && (
                        <button
                            onClick={() => {
                                setAssignTicketId(u.TicketID);
                                setAssignModalOpen(true);
                            }}
                            className="text-green-600 hover:text-green-900 flex items-center"
                        >
                            <AssignmentAddIcon fontSize="small" className="mr-1" /> Assign
                        </button>
                    )}

                    {u.Status === "Pending" && (
                        <button
                            onClick={() => {
                                setSelectedTicketId(u.TicketID);
                                setResolveModalOpen(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 flex items-center"
                        >
                            <DoneIcon fontSize="small" className="mr-1" /> Resolve
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            {showStats && <StatsRowOne />}

            <FiltersBar
                statusOptions={disableStatusFilter ? [] : statuses.map((s) => ({ label: s, value: s }))}
                roleOptions={roles.map((r) => ({ label: r.roleName, value: r.roleId.toString() }))}
                categoryOptions={categories.map((c) => ({ label: c.categoryName, value: c.categoryId.toString() }))}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
            />

            <CustomTable
                columns={columns}
                data={filteredTickets}
                pageSize={pageSize}
                totalRows={totalRows}
                currentPage={page}
                onPageChange={onPageChange}
            />

            <ResolveTicket
                isOpen={resolveModalOpen}
                onClose={() => setResolveModalOpen(false)}
                ticketId={selectedTicketId}
                onResolved={() => fetchTickets()}
                resolveApi={resolveTicket}
            />

            <AssignTicket
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                ticketId={assignTicketId}
                roles={roles.map((r) => ({
                    value: r.roleId.toString(),
                    label: r.roleName,
                }))}
                assignApi={assignTicket}
                onAssigned={() => fetchTickets()}
            />

            <ViewTicket
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                ticketData={viewTicketData}
            />
        </div>
    );
};

export default TicketsTable;