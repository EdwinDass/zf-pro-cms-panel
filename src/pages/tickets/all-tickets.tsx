import TicketsTable from "./components/TicketsTable";

const AllTickets = () => {
    return <TicketsTable showStats={true} disableStatusFilter={false} />;
};

export default AllTickets;
