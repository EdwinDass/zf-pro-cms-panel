// import React, { FC, useEffect, useState } from "react";
// import CustomTable from "../../../components/CustomTable";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
// import DoneIcon from "@mui/icons-material/Done";
// import StatsRowOne from "../components/StatsRowOne";
// import FiltersBar from "../components/FiltersBar";
// import {
//     getRoles,
//     getTicketCategories,
//     getTickets,
//     getTicketStatus,
// } from "../../../services/ApiService";

// interface Ticket {
//     TicketID: number;
//     Description: string;
//     Username: string;
//     email: string;
//     Status: string;
//     roleAssigned: string;
//     Category: string;
// }

// const labelColors: Record<string, string> = {
//     Pending: "bg-red-50 text-red-500",
//     Open: "bg-orange-50 text-orange-500",
//     Resolved: "bg-green-50 text-green-600",
//     "Account Access": "bg-red-50 text-red-600",
//     Communication: "bg-orange-50 text-orange-600",
//     Transactions: "bg-purple-50 text-purple-600",
//     "Rewards and Benefits": "bg-blue-50 text-blue-600",
//     "Profile Management": "bg-teal-50 text-teal-600",
//     "App Performance": "bg-indigo-50 text-indigo-600",
//     "Loyalty points": "bg-pink-50 text-pink-600",
// };

// interface Category {
//     categoryId: number;
//     categoryName: string;
// }

// interface Role {
//     roleId: number;
//     roleName: string;
// }

// const AllTickets: FC = () => {
//     const [tickets, setTickets] = useState<Ticket[]>([]);
//     const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [statuses, setStatuses] = useState<string[]>([]);
//     const [roles, setRoles] = useState<Role[]>([]);

//     useEffect(() => {
//         fetchTickets();
//         fetchCategories();
//         fetchRoles();
//         fetchStatuses();
//     }, []);

//     const fetchTickets = async () => {
//         try {
//             const response = await getTickets();
//             const raw = response?.data?.data?.data || [];

//             const mapped: Ticket[] = raw.map((x: any) => ({
//                 TicketID: x.ticket.ticketId,
//                 Category: x.category.name,
//                 Description: x.ticket.description,
//                 Username: x.user.name,
//                 email: x.user.email,
//                 Status: x.ticket.ticketStatus,
//                 roleAssigned: x.role.roleName,
//             }));

//             setTickets(mapped);
//             setFilteredTickets(mapped); // search uses this
//         } catch (error) {
//             console.error("Tickets fetch error:", error);
//         }
//     };

//     const fetchCategories = async () => {
//         try {
//             const response = await getTicketCategories();
//             const raw = response?.data?.data || [];

//             const mapped: Category[] = raw.map((x: any) => ({
//                 categoryId: x.ticketId,
//                 categoryName: x.ticketCategory,
//             }));
//             setCategories(mapped);
//         } catch (error) {
//             console.error("Categories fetch error:", error);
//         }
//     };

//     const fetchRoles = async () => {
//         try {
//             const response = await getRoles();
//             const raw = response?.data?.data || [];
//             const mapped: Role[] = raw.map((x: any) => ({
//                 roleId: x.roleId,
//                 roleName: x.roleName,
//             }));
//             setRoles(mapped);
//         } catch (error) {
//             console.error("Roles fetch error:", error);
//         }
//     };

//     const fetchStatuses = async () => {
//         try {
//             const response = await getTicketStatus();
//             const raw = response?.data?.data || [];
//             setStatuses(raw);
//         } catch (error) {
//             console.error("Statuses fetch error:", error);
//         }
//     };

//     /** 🔎 SEARCH HANDLER */
//     const handleSearch = (text: string) => {
//         const lower = text.toLowerCase();

//         const results = tickets.filter((t) =>
//             t.Description.toLowerCase().includes(lower) ||
//             t.Username.toLowerCase().includes(lower) ||
//             t.email.toLowerCase().includes(lower) ||
//             t.Category.toLowerCase().includes(lower) ||
//             t.Status.toLowerCase().includes(lower) ||
//             t.roleAssigned.toLowerCase().includes(lower)
//         );

//         setFilteredTickets(results);
//     };

//     const columns = [
//         { key: "TicketID", label: "Ticket ID" },
//         {
//             key: "Category",
//             label: "Category",
//             render: (row: any) => {
//                 const value = row.Category;
//                 const cls = labelColors[value] || "bg-gray-100 text-gray-600";
//                 return (
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
//                         {value}
//                     </span>
//                 );
//             },
//         },
//         { key: "Description", label: "Description" },
//         { key: "Username", label: "Username" },
//         { key: "email", label: "Email" },
//         { key: "roleAssigned", label: "Role Assigned" },
//         {
//             key: "Status",
//             label: "Status",
//             render: (row: any) => {
//                 const value = row.Status;
//                 const cls = labelColors[value] || "bg-gray-100 text-gray-600";
//                 return (
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
//                         {value}
//                     </span>
//                 );
//             },
//         },
//         {
//             key: "actions",
//             label: "Actions",
//             render: (u: Ticket) => (
//                 <div className="flex items-center space-x-4">
//                     <button className="text-blue-600 hover:text-blue-900 flex items-center">
//                         <RemoveRedEyeIcon fontSize="small" className="mr-1" /> View
//                     </button>
//                     <button className="text-green-600 hover:text-green-900 flex items-center">
//                         <AssignmentAddIcon fontSize="small" className="mr-1" /> Assign
//                     </button>
//                     <button className="text-purple-600 hover:text-purple-900 flex items-center">
//                         <DoneIcon fontSize="small" className="mr-1" /> Resolve
//                     </button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div>
//             <StatsRowOne />

//             <FiltersBar
//                 statusOptions={statuses.map((s) => ({
//                     label: s,
//                     value: s.toLowerCase(),
//                 }))}
//                 roleOptions={roles.map((r) => ({
//                     label: r.roleName,
//                     value: r.roleName.toLowerCase(),
//                 }))}
//                 categoryOptions={categories.map((c) => ({
//                     label: c.categoryName,
//                     value: c.categoryName.toLowerCase(),
//                 }))}
//                 onSearch={handleSearch}
//                 onFilterChange={(f) => console.log("filters:", f)}
//                 onApply={() => console.log("Apply filters")}
//             />

//             <CustomTable columns={columns} data={filteredTickets} pageSize={5} />
//         </div>
//     );
// };

// export default AllTickets;


import React, { FC, useEffect, useState } from "react";
import CustomTable from "../../../components/CustomTable";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import DoneIcon from "@mui/icons-material/Done";
import StatsRowOne from "../components/StatsRowOne";
import FiltersBar from "../components/FiltersBar";
import {
    getRoles,
    getTicketCategories,
    getTickets,
    getTicketStatus,
} from "../../../services/ApiService";

interface Ticket {
    TicketID: number;
    Description: string;
    Username: string;
    email: string;
    Status: string;
    roleAssigned: string;
    Category: string;
}

const labelColors: Record<string, string> = {
    Pending: "bg-red-50 text-red-500",
    Open: "bg-orange-50 text-orange-500",
    Resolved: "bg-green-50 text-green-600",
    "Account Access": "bg-red-50 text-red-600",
    Communication: "bg-orange-50 text-orange-600",
    Transactions: "bg-purple-50 text-purple-600",
    "Rewards and Benefits": "bg-blue-50 text-blue-600",
    "Profile Management": "bg-teal-50 text-teal-600",
    "App Performance": "bg-indigo-50 text-indigo-600",
    "Loyalty points": "bg-pink-50 text-pink-600",
};

interface Category {
    categoryId: number;
    categoryName: string;
}

interface Role {
    roleId: number;
    roleName: string;
}

const AllTickets: FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        fetchTickets();
        fetchCategories();
        fetchRoles();
        fetchStatuses();
    }, []);

    const fetchTickets = async (params?: any) => {
        try {
            const response = await getTickets(params);
            const raw = response?.data?.data?.data || [];

            const mapped: Ticket[] = raw.map((x: any) => ({
                TicketID: x.ticket.ticketId,
                Category: x.category.name,
                Description: x.ticket.description,
                Username: x.user.name,
                email: x.user.email,
                Status: x.ticket.ticketStatus,
                roleAssigned: x.role.roleName,
            }));

            setTickets(mapped);
            setFilteredTickets(mapped);
        } catch (error) {
            console.error("Tickets fetch error:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getTicketCategories();
            const raw = response?.data?.data || [];

            const mapped: Category[] = raw.map((x: any) => ({
                categoryId: x.ticketId,
                categoryName: x.ticketCategory,
            }));
            setCategories(mapped);
        } catch (error) {
            console.error("Categories fetch error:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            const raw = response?.data?.data || [];
            const mapped: Role[] = raw.map((x: any) => ({
                roleId: x.roleId,
                roleName: x.roleName,
            }));
            setRoles(mapped);
        } catch (error) {
            console.error("Roles fetch error:", error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await getTicketStatus();
            const raw = response?.data?.data || [];
            setStatuses(raw);
        } catch (error) {
            console.error("Statuses fetch error:", error);
        }
    };

    /** 🔎 SEARCH HANDLER */
    const handleSearch = (text: string) => {
        const lower = text.toLowerCase();

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

    /** 🔥 DROPDOWN FILTER HANDLER (calls backend) */
    const handleFilterChange = async (filters: any) => {
        const { status, role, category } = filters;

        await fetchTickets({
            ticketStatus: status !== "all" ? status : undefined,
            ticketCategoryId: category !== "all" ? category : undefined,
            roleAssigned: role !== "all" ? role : undefined,
        });
    };

    const columns = [
        { key: "TicketID", label: "Ticket ID" },
        {
            key: "Category",
            label: "Category",
            render: (row: any) => {
                const value = row.Category;
                const cls = labelColors[value] || "bg-gray-100 text-gray-600";
                return (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
                        {value}
                    </span>
                );
            },
        },
        { key: "Description", label: "Description" },
        { key: "Username", label: "Username" },
        { key: "email", label: "Email" },
        { key: "roleAssigned", label: "Role Assigned" },
        {
            key: "Status",
            label: "Status",
            render: (row: any) => {
                const value = row.Status;
                const cls = labelColors[value] || "bg-gray-100 text-gray-600";
                return (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
                        {value}
                    </span>
                );
            },
        },
        {
            key: "actions",
            label: "Actions",
            render: (u: Ticket) => (
                <div className="flex items-center space-x-4">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <RemoveRedEyeIcon fontSize="small" className="mr-1" /> View
                    </button>
                    <button className="text-green-600 hover:text-green-900 flex items-center">
                        <AssignmentAddIcon fontSize="small" className="mr-1" /> Assign
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 flex items-center">
                        <DoneIcon fontSize="small" className="mr-1" /> Resolve
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <StatsRowOne />

            <FiltersBar
                statusOptions={statuses.map((s) => ({
                    label: s,
                    value: s,
                }))}
                roleOptions={roles.map((r) => ({
                    label: r.roleName,
                    value: r.roleId.toString(),
                }))}
                categoryOptions={categories.map((c) => ({
                    label: c.categoryName,
                    value: c.categoryId.toString(),
                }))}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onApply={() => {}}
            />

            <CustomTable columns={columns} data={filteredTickets} pageSize={5} />
        </div>
    );
};

export default AllTickets;
