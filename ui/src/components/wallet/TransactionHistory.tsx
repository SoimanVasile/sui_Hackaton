import { ArrowUpRight, TrendingUp, CheckCircle2 } from "lucide-react";

interface Ticket {
  id: number;
  title: string;
  date: string;
  // adaugă alte câmpuri dacă e necesar
}

interface TransactionHistoryProps {
  tickets: Ticket[];
}

export function TransactionHistory({ tickets }: TransactionHistoryProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
        <span className="text-sm text-brand-600 font-medium cursor-pointer hover:underline">View All</span>
      </div>
      
      <div className="space-y-4">
        {/* Lista Bilete (Cheltuieli) */}
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                <ArrowUpRight size={20}/>
              </div>
              <div>
                <div className="font-bold text-gray-900">Payment Sent</div>
                <div className="text-sm text-gray-500">{ticket.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{ticket.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">- 15.00 SUI</div>
              <div className="flex items-center justify-end gap-1 text-xs font-medium text-green-600 mt-1">
                <CheckCircle2 size={12}/> Confirmed
              </div>
            </div>
          </div>
        ))}

        {/* Exemplu Top-Up (Intrare) */}
        <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-100 transition-colors">
              <TrendingUp size={20}/>
            </div>
            <div>
              <div className="font-bold text-gray-900">Wallet Top-up</div>
              <div className="text-sm text-gray-500">Deposit from Exchange</div>
              <div className="text-xs text-gray-400 mt-0.5">Jun 10, 2025</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-600">+ 300.00 SUI</div>
            <div className="flex items-center justify-end gap-1 text-xs font-medium text-green-600 mt-1">
              <CheckCircle2 size={12}/> Confirmed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
