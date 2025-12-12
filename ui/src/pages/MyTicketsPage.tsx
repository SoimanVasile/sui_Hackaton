import { Calendar, MapPin, QrCode, Download } from "lucide-react";
import { MY_TICKETS } from "../data";

export function MyTicketsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Tickets</h2>
      {MY_TICKETS.map(ticket => (
        <div key={ticket.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8 shadow-card mb-6">
          <img src={ticket.img} className="w-full md:w-56 h-36 object-cover rounded-xl" alt="Ticket" />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-purple-50 text-brand-600 rounded-full text-xs font-bold uppercase">{ticket.category}</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase">{ticket.status}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h3>
              <div className="text-gray-500 text-sm flex gap-6">
                 <span className="flex items-center gap-1"><Calendar size={14}/> {ticket.date}</span>
                 <span className="flex items-center gap-1"><MapPin size={14}/> {ticket.loc}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0">
              <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
                <QrCode size={18}/> View QR
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <Download size={18}/> PDF
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
