import { X, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { CartItemRow } from "./CartItemRow";
import { useCheckout } from "../../hooks/useCheckout";

export function CartDrawer() {
  const { items, removeFromCart, clearCart, isOpen, setIsOpen, totalPrice } = useCart();
  
  const { handleCheckout, isProcessing } = useCheckout();

  if (!isOpen) return null;

  const onCheckoutSuccess = () => {
    clearCart();
    setIsOpen(false);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-brand-600" /> My Cart
            <span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full">{items.length}</span>
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your cart is empty.</p>
              <button onClick={() => setIsOpen(false)} className="text-brand-600 font-bold hover:underline">
                Browse Events
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <CartItemRow 
                key={`${item.id}-${index}`} 
                item={item} 
                onRemove={removeFromCart} 
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Total Amount</span>
              <span className="text-3xl font-bold text-gray-900 tracking-tight">{totalPrice.toFixed(2)} <span className="text-sm text-gray-400 font-medium">SUI</span></span>
            </div>
            
            <button 
              onClick={() => handleCheckout(items, onCheckoutSuccess)}
              disabled={isProcessing}
              className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" /> Processing Batch...
                </>
              ) : (
                `Checkout (${items.length} Items)`
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">1-Click Batch Transaction powered by Sui</p>
          </div>
        )}
      </div>
    </>
  );
}

