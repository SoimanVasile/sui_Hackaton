import { TrendingDown, TrendingUp } from "lucide-react";

interface WalletStatsProps {
  totalSpent: number;
}

export function WalletStats({ totalSpent }: WalletStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* Total Spent Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 bg-opacity-20">
          <TrendingDown size={28}/>
        </div>
        <div>
          <div className="text-gray-400 text-sm font-medium mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-gray-900">{totalSpent}.00 SUI</div>
        </div>
      </div>

      {/* Total Top-ups Card (Static for demo) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500 bg-opacity-20">
          <TrendingUp size={28}/>
        </div>
        <div>
          <div className="text-gray-400 text-sm font-medium mb-1">Total Top-ups</div>
          <div className="text-2xl font-bold text-gray-900">300.00 SUI</div>
        </div>
      </div>
    </div>
  );
}
