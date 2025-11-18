import React, { FC, useEffect, useState } from "react";
import CustomTable from "../../../components/CustomTable";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import DoneIcon from '@mui/icons-material/Done';
interface Ticket {
    status: string;
    id: string;
    name: string;

}

const labelColors: Record<string, string> = {
    high: "bg-red-50 text-red-500",
    open: "bg-orange-50 text-orange-500",
    medium: "bg-yellow-50 text-yellow-600",
    low: "bg-green-50 text-green-600",
};

const AllTickets: FC = () => {
    const columns = [
        {
            key: "TicketID",
            label: "Ticket ID",
        },
        {
            key: "Category",
            label: "Category",
        },
        {
            key: "Description",
            label: "Description",
        },
        {
            key: "Username",
            label: "Username",
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "Labels",
            label: "Labels",
            render: (row: any) => (
                <div className="flex space-x-2">
                    {row.Labels?.map((label: string, idx: number) => {
                        const cls = labelColors[label.toLowerCase()] || "bg-gray-100 text-gray-600";
                        return (
                            <span
                                key={idx}
                                className={`px-4 py-1 rounded-full text-sm font-medium ${cls}`}
                            >
                                {label}
                            </span>
                        );
                    })}
                </div>
            ),
        },

        {
            key: "Status",
            label: "Status",
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
    ]
    return (
        <div>
            <CustomTable columns={columns} data={[{ TicketID: "1", Category: "Technical", Description: "Issue with server", Username: "User1", email: "user1@example.com", Labels: ["high", "open"], Status: "Open", Actions: <button>View</button> }, { TicketID: "2", Category: "Billing", Description: "Billing inquiry", Username: "User2", email: "user2@example.com", Labels: ["billing", "inquiry"], Status: "Closed", Actions: <button>View</button> }]} pageSize={4} />
        </div>
    );
};

export default AllTickets;