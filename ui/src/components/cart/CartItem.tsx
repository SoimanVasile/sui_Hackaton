import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as ICartItem } from "../../context/CartContext";

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (id: string | number, change: number) => void;
  onRemove: (id: string | number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 items-center group p-2 hover:bg-gray-50 rounded-2xl transition-colors">
      
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
         <img 
           src={item.img.startsWith("http") ? item.img : `https://placehold.co/${item.img}`} 
           alt={item.title}
           className="w-full h-full object-cover"
           onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"}
         />
      </div>

      <div className="flex-1">
        <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
        <p className="text-sm text-gray-500 mb-2">{item.price} SUI</p>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95"
          >
            <Minus size={14} className="text-gray-600"/>
          </button>
          
          <span className="font-bold text-gray-900 w-4 text-center select-none">
            {item.quantity}
          </span>
          
          <button 
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95"
          >
            <Plus size={14} className="text-gray-600"/>
          </button>
        </div>
      </div>

      <button 
        onClick={() => onRemove(item.id)}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Remove Item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
