// tickets/pages/ResolvedTickets.tsx
import TicketsTable from "./components/TicketsTable";

const ResolvedTickets = () => {
    return <TicketsTable defaultStatus="Resolved" showStats={false} disableStatusFilter={true} />;
};

export default ResolvedTickets;
