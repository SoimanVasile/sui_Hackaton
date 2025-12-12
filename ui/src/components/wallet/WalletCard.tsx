import { Wallet, Plus } from "lucide-react";

interface WalletCardProps {
  balanceSUI: number;
  balanceUSD: string;
  address: string;
  isPending: boolean;
}

export function WalletCard({ balanceSUI, balanceUSD, address, isPending }: WalletCardProps) {
  return (
    <div className="bg-gradient-to-r from-brand-600 to-purple-500 rounded-3xl p-10 text-white shadow-2xl mb-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900 opacity-10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
      
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
          {isPending ? (
            <span className="text-4xl font-bold opacity-50">Loading...</span>
          ) : (
            <>
              <span className="text-6xl font-bold tracking-tight">{balanceSUI.toFixed(2)}</span>
              <span className="text-2xl font-medium opacity-80 ml-2">SUI</span>
            </>
          )}
        </div>
        <div className="opacity-80 text-lg font-medium">≈ ${balanceUSD} USD</div>
        
        {/* Address Badge */}
        <div className="mt-4 text-xs bg-black/20 inline-block px-3 py-1 rounded-lg font-mono text-white/70">
          {address}
        </div>
      </div>
    </div>
  );
}
