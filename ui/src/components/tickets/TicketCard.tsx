import { useState } from "react";
import { Calendar, MapPin, QrCode, Send, Info, X } from "lucide-react";
import QRCode from "react-qr-code";
import { TransferModal } from "./TransferModal";

interface TicketProps {
  ticket: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    loc?: string;
    category?: string;
    status?: string;
    image: string;
    name?: string;
  };
}

export function TicketCard({ ticket }: TicketProps) {
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const displayTitle = ticket.title || ticket.name || "Untitled Ticket";
  const displayImg = ticket.image || "https://via.placeholder.com/400";

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/3 relative overflow-hidden h-56 md:h-auto bg-gray-100">
          <img 
            src={displayImg.replace("ipfs://", "https://ipfs.io/ipfs/")} 
            alt={displayTitle} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            onError={(e) => e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image"}
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded-md border border-white/20">
            ID: {ticket.id.slice(0, 6)}...
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold uppercase tracking-wide">
                {ticket.category || "Event Ticket"}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold uppercase tracking-wide">
                Active
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayTitle}</h3>
            
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
              {ticket.description || "No description available."}
            </p>
          </div>

          <div className="flex gap-3 border-t border-gray-50 pt-4">
            <button 
              onClick={() => setIsQrOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 active:scale-95"
            >
              <QrCode size={18}/> Show QR Code
            </button>
            
            <button onClick={() => setIsTransferOpen(true)} className="p-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors">
              <Send size={18}/>
            </button>
          </div>
        </div>
      </div>

      {isQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsQrOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-bold mb-2">Scan for Entry</h3>
            <p className="text-gray-500 mb-6 text-sm">Present this code to the event organizer</p>
            
            <div className="bg-white p-4 rounded-xl border-2 border-brand-100 inline-block mb-4">
              <QRCode 
                value={ticket.id}
                size={200}
                viewBox={`0 0 256 256`}
              />
            </div>
            <p className="font-mono text-xs text-gray-400 break-all">{ticket.id}</p>
          </div>
        </div>
      )}

      {isTransferOpen && (
        <TransferModal 
          ticketId={ticket.id}
          ticketTitle={displayTitle} 
          onClose={() => setIsTransferOpen(false)} 
        />
      )}
    </>
  );
}
