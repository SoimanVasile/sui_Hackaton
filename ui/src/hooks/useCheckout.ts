import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CartItem } from "../context/CartContext";
import { PACKAGE_ID, MODULE_NAME, FUNCTION_NAME } from "../constants";

export function useCheckout() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = (items: CartItem[], onSuccess: () => void) => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsProcessing(true);
    const tx = new Transaction();

    items.forEach((item) => {
      const amountInMist = item.price * 1_000_000_000;

      const [ticketPaymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
        arguments: [
          ticketPaymentCoin,                     
          tx.pure.string(item.title),            
          tx.pure.string(item.category),         
          tx.pure.string(item.img),              
          tx.pure.u64(amountInMist),             
        ],
      });
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("Batch Transaction Successful:", result);
          alert(`Success! Purchased ${items.length} tickets.`);
          setIsProcessing(false);
          onSuccess();
        },
        onError: (error) => {
          console.error("Checkout Failed:", error);
          alert("Transaction failed. Check console for details.");
          setIsProcessing(false);
        },
      }
    );
  };

  return { handleCheckout, isProcessing };
}
