import React, { useEffect, useState } from "react";
import Card from "./Card";
import { FaTicketAlt, FaExclamationCircle, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { getMemberCount, getScannedPoints, getRedeemedPoints, getTicketCountByStatus } from "../../../services/ApiService";

const StatsRowOne: React.FC = () => {

    const [totalTicketsCount, setTotalTicketsCount] = useState("0");
    const [openTicketsCount, setOpenTicketsCount] = useState("0");
    const [closedTicketsCount, setClosedTicketsCount] = useState("0");


    useEffect(() => {
        fetchTotalTicketCount();
        fetchOpenTicketCount();
        fetchClosedTicketCount();
    }, []);

    const fetchTotalTicketCount = async () => {
        try {
            const response = await getTicketCountByStatus();
            setTotalTicketsCount(response?.data?.data?.count?.toString() || "0");
        } catch (error) {
            console.error("Total tickets error:", error);
        }
    };

    const fetchOpenTicketCount = async () => {
        try {
            const response = await getTicketCountByStatus("Pending");
            setOpenTicketsCount(response?.data?.data?.count?.toString() || "0");
        } catch (error) {
            console.error("Open tickets error:", error);
        }
    };

    const fetchClosedTicketCount = async () => {
        try {
            const response = await getTicketCountByStatus("Closed");
            setClosedTicketsCount(response?.data?.data?.count?.toString() || "0");
        } catch (error) {
            console.error("Closed tickets error:", error);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

            {/* CARD 1 */}
            <Card
                title="Total Tickets"
                value={totalTicketsCount}
                percentage="+12.5%"
                percentageColor="text-green-600"
                icon={<FaTicketAlt />}
                iconColor='text-blue-500'
            />

            {/* CARD 2 */}
            <Card
                title="Open Tickets"
                value={openTicketsCount}
                percentage="+4.2%"
                percentageColor="text-green-600"
                icon={<FaExclamationCircle />}
                iconColor='text-orange-500'
            />

            {/* CARD 4 (static now) */}
            <Card
                title="Resolved Tickets"
                value={closedTicketsCount}
                percentage="-3.4%"
                percentageColor="text-red-600"
                icon={<FaCheckCircle />}
                iconColor='text-green-500'
            />
        </div>
    );
};

export default StatsRowOne;
