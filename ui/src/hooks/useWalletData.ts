import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useUserTickets } from "./useUserTickets";
import { useState, useEffect } from "react";

export function useWalletData() {
  const account = useCurrentAccount();
  const { tickets, isLoading: isTicketsLoading } = useUserTickets();
  
  const [suiPrice, setSuiPrice] = useState<number>(0); 

  const { data: balanceData, isPending: isBalancePending } = useSuiClientQuery(
    'getBalance',
    { owner: account?.address || '' },
    { enabled: !!account }
  );

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd");
        const data = await response.json();
        setSuiPrice(data.sui.usd);
      } catch (error) {
        console.error("Failed to fetch SUI price:", error);
        setSuiPrice(1.50);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalMist = balanceData ? parseInt(balanceData.totalBalance) : 0;
  const balanceSUI = totalMist / 1_000_000_000;
  
  const balanceUSD = (balanceSUI * suiPrice).toFixed(2);
  
  const totalSpent = tickets.length * 10; 
  
  const totalReceived = balanceSUI + totalSpent;

  return {
    account,
    tickets,
    balanceSUI,
    balanceUSD,
    totalSpent,
    totalReceived,
    suiPrice,
    isLoading: isBalancePending || isTicketsLoading
  };
}
