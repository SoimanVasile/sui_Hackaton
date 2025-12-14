import { Loader2 } from "lucide-react";

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  isProcessing?: boolean;
}

export function CartSummary({ total, itemCount, onCheckout, isProcessing = false }: CartSummaryProps) {
  return (
    <div className="p-6 border-t border-gray-100 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-500 font-medium">Total Amount</span>
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          {total.toFixed(3)} <span className="text-sm text-gray-400 font-medium">SUI</span>
        </span>
      </div>
      
      <button
        onClick={onCheckout}
        disabled={itemCount === 0 || isProcessing}
        className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <><Loader2 className="animate-spin" /> Processing...</>
        ) : (
          `Checkout (${itemCount} items)`
        )}
      </button>
    </div>
  );
}
