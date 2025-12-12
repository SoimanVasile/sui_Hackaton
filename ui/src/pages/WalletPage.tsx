import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Wallet, Plus, TrendingDown, TrendingUp } from "lucide-react";

export function WalletPage() {
  const account = useCurrentAccount();
  const { data: balance } = useSuiClientQuery('getBalance', { owner: account?.address || '' });
  const suiBalance = balance ? (parseInt(balance.totalBalance) / 1_000_000_000).toFixed(2) : "0.00";
  const usdValue = (parseFloat(suiBalance) * 1.5).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-gradient-to-r from-brand-600 to-purple-500 rounded-3xl p-10 text-white shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              <Wallet size={16}/> Wallet Balance
            </div>
            <button className="bg-white text-brand-600 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg">
              <Plus size={18}/> Top Up
            </button>
          </div>
          <div className="mb-2">
            <span className="text-6xl font-bold tracking-tight">{suiBalance}</span>
            <span className="text-2xl font-medium opacity-80 ml-2">SUI</span>
          </div>
          <div className="opacity-80 text-lg font-medium">≈ ${usdValue} USD</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500"><TrendingDown size={28}/></div>
          <div><div className="text-gray-400 text-sm font-medium mb-1">Total Spent</div><div className="text-2xl font-bold text-gray-900">$190.00</div></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500"><TrendingUp size={28}/></div>
          <div><div className="text-gray-400 text-sm font-medium mb-1">Total Top-ups</div><div className="text-2xl font-bold text-gray-900">$300.00</div></div>
        </div>
      </div>
    </div>
  );
}
