import TicketsTable from "./components/TicketsTable";

const PendingTickets = () => {
    return <TicketsTable defaultStatus="Pending" showStats={false} disableStatusFilter={true} />;
};

export default PendingTickets;