import { ArrowUpRight, TrendingUp, CheckCircle2 } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  date: string;
}

interface TransactionHistoryProps {
  tickets: Ticket[];
  totalReceived: number; // NEW PROP: We need this to show the correct top-up amount
}

export function TransactionHistory({ tickets, totalReceived }: TransactionHistoryProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
        <span className="text-sm text-gray-400 font-medium">Auto-Calculated</span>
      </div>
      
      <div className="space-y-4">
        
        {/* 1. OUTGOING: Ticket Purchases */}
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                <ArrowUpRight size={20}/>
              </div>
              <div>
                <div className="font-bold text-gray-900">Payment Sent</div>
                <div className="text-sm text-gray-500">{ticket.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">Ticket Purchase</div>
              </div>
            </div>
            <div className="text-right">
              {/* FIXED: Matches the 10 SUI math in useWalletData */}
              <div className="font-bold text-gray-900">- 10.00 SUI</div>
              <div className="flex items-center justify-end gap-1 text-xs font-medium text-green-600 mt-1">
                <CheckCircle2 size={12}/> Confirmed
              </div>
            </div>
          </div>
        ))}

        {/* 2. INCOMING: Initial Funding (Calculated) */}
        {/* We show this only if we have received money */}
        {totalReceived > 0 && (
          <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-100 transition-colors">
                <TrendingUp size={20}/>
              </div>
              <div>
                <div className="font-bold text-gray-900">Wallet Funding</div>
                <div className="text-sm text-gray-500">Initial Deposit & Top-ups</div>
                <div className="text-xs text-gray-400 mt-0.5">Calculated Total</div>
              </div>
            </div>
            <div className="text-right">
              {/* DYNAMIC: Shows exactly what's needed to match your balance */}
              <div className="font-bold text-green-600">+ {totalReceived.toFixed(2)} SUI</div>
              <div className="flex items-center justify-end gap-1 text-xs font-medium text-green-600 mt-1">
                <CheckCircle2 size={12}/> Confirmed
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
