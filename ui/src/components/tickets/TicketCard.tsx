import { useState } from "react";
import { Calendar, MapPin, QrCode, Send, Info } from "lucide-react";
import { TransferModal } from "./TransferModal"; // Import the modal

interface TicketProps {
  ticket: {
    id: string;
    title: string;
    date: string;
    loc: string;
    category: string;
    status: string;
    img: string;
    tokenId: string;
    description?: string;
  };
}

export function TicketCard({ ticket }: TicketProps) {
  // State to control the modal
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row">
        
        {/* 1. Left Image */}
        <div className="w-full md:w-1/3 relative overflow-hidden h-56 md:h-auto bg-gray-100">
          <img 
            src={ticket.img.replace("ipfs://", "https://ipfs.io/ipfs/")} 
            alt={ticket.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            onError={(e) => e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image"}
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded-md border border-white/20">
            ID: {ticket.tokenId.slice(0, 6)}...
          </div>
        </div>

        {/* 2. Right Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold uppercase tracking-wide">
                {ticket.category || "Collectible"}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold uppercase tracking-wide">
                {ticket.status}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h3>
            
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
              {ticket.description || "No description available for this NFT."}
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} className="text-brand-500"/> 
                {ticket.date}
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={16} className="text-brand-500"/> 
                {ticket.loc}
              </div>
            </div>
          </div>

          {/* 3. Buttons */}
          <div className="flex gap-3 border-t border-gray-50 pt-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 active:scale-95">
              <QrCode size={18}/> Show Code
            </button>
            
            {/* The SEND Button */}
            <button 
              onClick={() => setIsTransferOpen(true)}
              className="p-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors" 
              title="Send to Friend"
            >
              <Send size={18}/>
            </button>
            
            <button className="p-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors" title="View Details">
              <Info size={18}/>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Render the Modal when open */}
      {isTransferOpen && (
        <TransferModal 
          ticketId={ticket.id}
          ticketTitle={ticket.title} 
          onClose={() => setIsTransferOpen(false)} 
        />
      )}
    </>
  );
}
