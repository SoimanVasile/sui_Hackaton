import { useCart } from "../../context/CartContext";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../../constants";

export function Cart() {
  const { items, isOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const displayTotal = Number(total.toFixed(3));

  const handleCheckout = () => {
    if (!account) return alert("Connect Wallet first!");
    if (items.length === 0) return;

    const tx = new Transaction();

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
            coin,
            tx.pure.string(item.title),
            tx.pure.string("Standard Ticket"),
            tx.pure.string(safeImageUrl),
            tx.pure.u64(priceInMist),
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
        },
        onError: (err) => {
          console.error("Purchase failed", err);
          alert("Transaction failed. See console.");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={toggleCart} 
      />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
        
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-10">Your cart is empty</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                   <img 
                     src={item.img.startsWith("http") ? item.img : `https://placehold.co/${item.img}`} 
                     alt={item.title}
                     className="w-full h-full object-cover"
                   />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">{item.price} SUI</p>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={14} className="text-gray-600"/>
                    </button>
                    <span className="font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={14} className="text-gray-600"/>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-medium">Total Amount</span>
            <span className="text-3xl font-bold text-gray-900">{displayTotal} SUI</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Checkout ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
          </button>
        </div>
      </div>
    </div>
  );
}
