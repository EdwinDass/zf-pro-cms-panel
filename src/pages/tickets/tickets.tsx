import React, { useState } from "react";
import TopBar from "../../layouts/top-bar";
import AllTickets from "./all-tickets";
import PendingTickets from "./PendingTickets";
import ResolvedTickets from "./ResolvedTickets";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userDataSlice";
import { clearTokens } from "../../redux/slices/authTokenSlice";
import { userLogout, getTickets } from "../../services/ApiService";
import CreateTicket from "./components/CreateTicket";
import ExportButton from "../../components/ExportButton";

const Tickets = () => {
    const [activeTab, setActiveTab] = useState("all-tickets");
    const [showModal, setShowModal] = useState(false);  // <<< added modal state
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await userLogout();
        } catch (err) {
            console.error("Logout API failed:", err);
        }
        dispatch(logoutUser());
        dispatch(clearTokens());
        navigate("/");
    };

    const exportTickets = async () => {
        try {
            const payload: any = {
                page: 1,
                limit: 10000,
            };
            if (activeTab === "pending") {
                payload.ticketStatus = "Pending";
            } else if (activeTab === "resolved") {
                payload.ticketStatus = "Resolved";
            }

            const response = await getTickets(payload);
            const raw = response?.data?.data?.data || [];

            const mapped = raw.map((x: any) => ({
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
            }));

            return mapped;
        } catch (error) {
            console.error("Tickets export error:", error);
            return [];
        }
    };

    const tabs = [
        { id: "all-tickets", label: "All Tickets" },
        { id: "pending", label: "Pending" },
        { id: "resolved", label: "Resolved" },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-100 pb-10">
            <div className="bg-white">
                <TopBar
                    title="Tickets Management"
                    description="Manage customer support tickets and inquiries"
                    actionButton={
                        <div className="flex items-center gap-3">
                            <ExportButton exporter={exportTickets} reportName="Tickets List" />
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                onClick={() => setShowModal(true)}   // <<< opens modal
                            >
                                Create Ticket
                            </button>
                        </div>
                    }
                    logout={logout}
                />
            </div>

            {/* TABS SECTION */}
            <div>
                <div
                    className="
                        flex gap-12 
                        border border-gray-200 
                        rounded-xl 
                        px-6 py-4 
                        ml-6 
                        mr-6
                        mt-7
                        bg-white
                    "
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                pb-4 
                                text-lg font-semibold 
                                tracking-wide
                                transition-all 
                                ${activeTab === tab.id
                                    ? "text-blue-600 border-b-4 border-blue-600"
                                    : "text-gray-600 hover:text-gray-800"
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="mt-8 px-6">
                {activeTab === "all-tickets" && <AllTickets />}
                {activeTab === "pending" && <PendingTickets />}
                {activeTab === "resolved" && <ResolvedTickets />}
            </div>

            {/* MODAL RENDER */}
            {showModal && (
                <CreateTicket onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

export default Tickets;