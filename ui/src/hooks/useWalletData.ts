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
        if (data && data.sui && data.sui.usd) {
          setSuiPrice(data.sui.usd); 
        } else {
          setSuiPrice(3.50);
        }
      } catch (error) {
        console.error("Failed to fetch SUI price:", error);
        setSuiPrice(3.50);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const totalMist = balanceData ? parseInt(balanceData.totalBalance) : 0;
  const balanceSUI = totalMist / 1_000_000_000;
  
  const currentSuiPrice = suiPrice || 0;
  const balanceUSD = (balanceSUI * currentSuiPrice).toFixed(2);
  
  const totalSpent = tickets.reduce((sum, ticket) => sum + ticket.price, 0); 
  
  const totalReceived = balanceSUI + totalSpent;

console.log("Total Spent Calculated:", totalSpent); 
  console.log("Ticket Array Data:", tickets);

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
