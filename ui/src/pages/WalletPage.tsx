import { useWalletData } from "../hooks/useWalletData"; // Our new hook
import { WalletCard } from "../components/wallet/WalletCard";
import { WalletStats } from "../components/wallet/WalletStats";
import { WalletAssets } from "../components/wallet/WalletAssets";
import { TransactionHistory } from "../components/wallet/TransactionHistory";
import { WalletNotConnected } from "../components/wallet/WalletNotConnected";

export function WalletPage() {
  // All logic is now hidden inside this hook
  const { 
    account, 
    tickets, 
    balanceSUI, 
    balanceUSD, 
    totalSpent, 
    totalReceived, 
    isLoading 
  } = useWalletData();

  if (!account) {
    return <WalletNotConnected />;
  }

  if (isLoading || !tickets || tickets.length === 0) {
    return <div className="text-center py-20 text-gray-400">Loading wallet data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      
      <WalletCard 
        balanceSUI={balanceSUI}
        balanceUSD={balanceUSD}
        address={account.address}
        isPending={isLoading}
      />

      <WalletStats 
        totalSpent={totalSpent} 
        totalReceived={totalReceived} 
      />

      <WalletAssets tickets={tickets} />

      <TransactionHistory 
        tickets={tickets} 
        totalReceived={totalReceived}
      />

    </div>
  );
}
