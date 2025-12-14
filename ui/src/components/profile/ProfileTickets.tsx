import { Loader2, Ticket } from "lucide-react";
import { TicketCard } from "../tickets/TicketCard";
import { Item } from "../../hooks/useUserTickets";

interface ProfileTicketsProps {
  tickets: Item[];
  isLoading: boolean;
}

export function ProfileTickets({ tickets, isLoading }: ProfileTicketsProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Ticket className="text-brand-600" /> Event Tickets
      </h2>
      
      <div className="grid gap-6">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
        
        {tickets.length === 0 && !isLoading && (
             <p className="text-gray-400 italic">No tickets found.</p>
        )}
        
        {isLoading && <Loader2 className="animate-spin" />}
      </div>
    </div>
  );
}
