import { useCart } from "../../context/CartContext";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../../constants";
import { useState } from "react";

import { CartHeader } from "./CartHeader";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function Cart() {
  const { items, isOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!account) return alert("Connect Wallet first!");
    if (items.length === 0) return;

    setIsProcessing(true);
    const tx = new Transaction();

    try {
      items.forEach((item) => {
        const priceInMist = BigInt(Math.floor(item.price * 1_000_000_000));
        
        let safeImageUrl = item.img;
        if (safeImageUrl.length > 500) safeImageUrl = "https://placehold.co/400x400?text=Ticket";
        if (safeImageUrl.startsWith("400x")) safeImageUrl = `https://placehold.co/${safeImageUrl}`;

        for (let i = 0; i < item.quantity; i++) {
          const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInMist)]);
          
          tx.moveCall({
            target: `${PACKAGE_ID}::ticket_nft::buy_ticket`,
            arguments: [
               tx.object(item.id),
               coin
            ],
          });
        }
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            alert("Purchase Successful!");
            clearCart();
            toggleCart();
            setIsProcessing(false);
          },
          onError: (err) => {
            console.error("Purchase failed", err);
            alert("Transaction failed. Check console.");
            setIsProcessing(false);
          },
        }
      );
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={toggleCart} 
      />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <CartHeader 
          onClose={toggleCart} 
          itemCount={items.length} 
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onUpdateQuantity={updateQuantity} 
                onRemove={removeFromCart} 
              />
            ))
          )}
        </div>

        <CartSummary 
          total={total} 
          itemCount={totalItems} 
          onCheckout={handleCheckout} 
          isProcessing={isProcessing}
        />
        
      </div>
    </div>
  );
}
