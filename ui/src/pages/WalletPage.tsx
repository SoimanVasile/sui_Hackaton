import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { AlertCircle } from "lucide-react";
import { MY_TICKETS } from "../data";
import { WalletCard } from "../components/wallet/WalletCard";
import { WalletStats } from "../components/wallet/WalletStats";
import { TransactionHistory } from "../components/wallet/TransactionHistory";

export function WalletPage() {
  const account = useCurrentAccount();

  // 1. Data Fetching
  const { data: balanceData, isPending } = useSuiClientQuery(
    'getBalance',
    { owner: account?.address || '' },
    { enabled: !!account }
  );

  // 2. Calculations
  const totalMist = balanceData ? parseInt(balanceData.totalBalance) : 0;
  const balanceSUI = totalMist / 1_000_000_000;
  const suiPrice = 3.50;
  const balanceUSD = (balanceSUI * suiPrice).toFixed(2);
  const totalSpent = MY_TICKETS.length * 15; // Mock calculation

  // 3. Not Connected State
  if (!account) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 shadow-card inline-block border border-red-100">
          <AlertCircle className="w-16 h-16 text-brand-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-500">Please connect your Sui wallet using the button in the navbar.</p>
        </div>
      </div>
    );
  }

  // 4. Render Main Page
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      
      <WalletCard 
        balanceSUI={balanceSUI}
        balanceUSD={balanceUSD}
        address={account.address}
        isPending={isPending}
      />

      <WalletStats totalSpent={totalSpent} />

      <TransactionHistory tickets={MY_TICKETS} />

    </div>
  );
}
