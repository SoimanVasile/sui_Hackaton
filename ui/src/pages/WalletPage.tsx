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

  // 1. Show Warning if not connected
  if (!account) {
    return <WalletNotConnected />;
  }

  // 2. Show Loading State (Optional, but good UX)
  if (isLoading) {
    return <div className="text-center py-20 text-gray-400">Loading wallet data...</div>;
  }

  // 3. Show The Wallet Dashboard
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
