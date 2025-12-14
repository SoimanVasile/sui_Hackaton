import { ArrowUpRight, TrendingUp, CheckCircle2 } from "lucide-react";


interface TransactionItemProps {
  type: "incoming" | "outgoing";
  title: string;
  subtitle: string;
  amount: number;
  label?: string;
}

export function TransactionItem({ type, title, subtitle, amount, label }: TransactionItemProps) {
  const isIncoming = type === "incoming";

  return (
    <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
          isIncoming 
            ? "bg-green-50 text-green-500 group-hover:bg-green-100" 
            : "bg-red-50 text-red-500 group-hover:bg-red-100"
        }`}>
          {isIncoming ? <TrendingUp size={20} /> : <ArrowUpRight size={20} />}
        </div>
        
        <div>
          <div className="font-bold text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
          {label && <div className="text-xs text-gray-400 mt-0.5">{label}</div>}
        </div>
      </div>

      <div className="text-right">
        <div className={`font-bold ${isIncoming ? "text-green-600" : "text-gray-900"}`}>
          {isIncoming ? "+" : "-"} {amount.toFixed(2)} SUI
        </div>
        <div className="flex items-center justify-end gap-1 text-xs font-medium text-green-600 mt-1">
          <CheckCircle2 size={12} /> Confirmed
        </div>
      </div>
    </div>
  );
}
