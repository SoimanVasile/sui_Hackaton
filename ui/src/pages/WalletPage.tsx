import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Wallet, Coins, CreditCard, Loader2, ExternalLink } from "lucide-react";
import { useUserTickets } from "../hooks/useUserTickets";

export function WalletPage() {
  const account = useCurrentAccount();

  const { data: balanceData, isLoading: isBalanceLoading } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address || "" },
    { enabled: !!account }
  );

  const { tickets, isLoading: isAssetsLoading } = useUserTickets();

  const balance = balanceData 
    ? (Number(balanceData.totalBalance) / 1_000_000_000).toFixed(4) 
    : "0.0000";

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Wallet className="text-gray-400" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet Dashboard</h1>
          <p className="text-gray-500 mt-2">Connect your wallet to view your balance and assets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wallet</h1>

      <div className="bg-gradient-to-br from-brand-900 to-gray-900 text-white rounded-3xl p-8 shadow-xl mb-10 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-gray-400 font-medium flex items-center gap-2 mb-2">
            <Coins size={18} /> Total Balance
          </p>
          <div className="text-5xl font-bold tracking-tight mb-4">
            {isBalanceLoading ? (
              <Loader2 className="animate-spin" /> 
            ) : (
              `${balance} SUI`
            )}
          </div>
          <div className="bg-white/10 inline-block px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 text-sm font-mono break-all">
            {account.address}
          </div>
        </div>
        
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <CreditCard size={200} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CreditCard className="text-brand-600" /> Digital Assets
        </h2>

        {isAssetsLoading ? (
          <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : tickets.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-500">You don't own any tickets or badges yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {tickets.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-5 hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mb-1 inline-block
                        ${item.type === 'Badge' ? 'bg-yellow-100 text-yellow-700' : 'bg-brand-100 text-brand-700'}`}>
                        {item.type}
                      </span>
                      <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                  
                  <a 
                    href={`https://suiscan.xyz/testnet/object/${item.id}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-brand-500 hover:text-brand-700 flex items-center gap-1 mt-3"
                  >
                    View on Explorer <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
