import { TransactionItem } from "./TransactionItem";
import { getRealPrice } from "../../data/eventsData"; // <--- Import the helper

interface Ticket {
  id: string;
  title: string;
  category: string;
}

interface TransactionHistoryProps {
  tickets: Ticket[];
  totalReceived: number;
}

export function TransactionHistory({ tickets, totalReceived }: TransactionHistoryProps) {
  
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
        <span className="text-sm text-gray-400 font-medium">Synced with Event Data</span>
      </div>
      
      <div className="space-y-4">
        
        {/* 1. OUTGOING: Ticket Purchases */}
        {tickets.map((ticket) => (
          <TransactionItem 
            key={ticket.id}
            type="outgoing"
            title="Payment Sent"
            subtitle={ticket.title}
            label="Ticket Purchase"
            amount={getRealPrice(ticket.title)} 
          />
        ))}

        {/* 2. INCOMING: Initial Funding */}
        {totalReceived > 0 && (
          <TransactionItem 
            type="incoming"
            title="Wallet Funding"
            subtitle="Initial Deposit & Top-ups"
            label="Calculated Total"
            amount={totalReceived}
          />
        )}

      </div>
    </div>
  );
}
