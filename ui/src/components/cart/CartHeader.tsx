import { X } from "lucide-react";

interface CartHeaderProps {
  onClose: () => void;
  itemCount: number;
}

export function CartHeader({ onClose, itemCount }: CartHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        Your Cart
        {itemCount > 0 && (
          <span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full">
            {itemCount}
          </span>
        )}
      </h2>
      <button 
        onClick={onClose} 
        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  );
}
