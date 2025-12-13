import { Trash2 } from "lucide-react";
import { CartItem } from "../../context/CartContext";

interface CartItemRowProps {
  item: CartItem;
  onRemove: (id: string | number) => void;
}

export function CartItemRow({ item, onRemove }: CartItemRowProps) {
  return (
    <div className="flex gap-4 p-3 rounded-2xl border border-gray-100 bg-gray-50/30 hover:bg-white transition-colors group">
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
        <img 
          src={item.img} 
          alt={item.title} 
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/100"; }}
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
          <span className="text-xs text-brand-600 font-bold uppercase">{item.category}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-mono font-bold text-gray-900">{item.price} SUI</span>
          <button 
            onClick={() => onRemove(item.id)} 
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Remove from Cart"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
