import { Calendar, MapPin, ShoppingCart } from "lucide-react";


interface EventProps {
  event: {
    id: number | string;
    title: string;
    date: string;
    loc: string;
    price: number;
    category: string;
    img: string;
  };
  onAdd: (event: any) => void;
}

export function EventCard({ event, onAdd }: EventProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-card hover:shadow-xl transition-all group flex flex-col h-full">
      
      <div className="relative h-56 overflow-hidden">
        <img 
          src={event.img} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={event.title} 
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
            e.currentTarget.onerror = null; 
          }}
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-brand-700 shadow-sm">
          {event.price} SUI
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
           <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold uppercase">
             {event.category}
           </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight flex-1">{event.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-500"/> {event.date}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-brand-500"/> {event.loc}
          </div>
        </div>

        <button 
          onClick={() => onAdd(event)}
          className="w-full py-3.5 rounded-xl font-bold bg-white border-2 border-brand-100 text-brand-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
        >
          <ShoppingCart size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
