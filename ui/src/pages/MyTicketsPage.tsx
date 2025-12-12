import { Ticket } from "lucide-react";
import { useUserTickets } from "../hooks/useUserTickets";
import { TicketCard } from "../components/tickets/TicketCard";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function MyTicketsPage() {
  const account = useCurrentAccount();
  const { tickets, isLoading } = useUserTickets();

  if (!account) {
     return <div className="text-center py-20">Please connect your wallet.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-100 p-3 rounded-2xl text-brand-600">
          <Ticket size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My NFT Tickets</h2>
          <p className="text-gray-500">Manage your collectibles and access events</p>
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
           <p>Loading your NFTs...</p>
        ) : tickets.length > 0 ? (
          tickets.map(ticket => (
            <TicketCard 
                key={ticket.id} 
                ticket={{
                    ...ticket,
                    date: "Open Access",
                    loc: "Digital / Global", 
                    status: "Owned"
                }} 
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <p className="text-gray-400 text-lg">You don't have any NFTs in this wallet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
