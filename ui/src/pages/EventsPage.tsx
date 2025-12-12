import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Search, Calendar, MapPin } from "lucide-react";
import { PACKAGE_ID, MODULE_NAME, FUNCTION_NAME } from "../constants";
import { EVENTS } from "../data";

export function EventsPage() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const [activeFilter, setActiveFilter] = useState("All");

  const handlePurchase = (event: any) => {
    if (!account) { alert("Please connect wallet first"); return; }
    
    const tx = new Transaction();
    const amountInMist = event.price * 1_000_000_000; 
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [coin],
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: (res) => alert(`Successfully bought ticket! Digest: ${res.digest}`),
      onError: (err) => console.error("Purchase failed", err)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <Search className="text-gray-400 ml-4" size={20} />
        <input type="text" placeholder="Search events or locations..." className="flex-1 py-3 outline-none text-gray-700"/>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6">
        {["All", "Music", "Sports", "Theater", "Comedy", "Conference"].map((cat) => (
          <button key={cat} onClick={() => setActiveFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeFilter === cat ? 'bg-brand-600 text-white shadow-glow' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EVENTS.map(evt => (
          <div key={evt.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-card hover:shadow-xl transition-all group">
            <div className="relative h-56 overflow-hidden">
              <img src={evt.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={evt.title} />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-brand-700 shadow-sm">
                {evt.price} SUI
              </div>
            </div>
            <div className="p-6">
              <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold uppercase mb-3">{evt.category}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{evt.title}</h3>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-500"/> {evt.date}</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-brand-500"/> {evt.loc}</div>
              </div>
              <button onClick={() => handlePurchase(evt)} className="w-full py-3.5 rounded-xl font-bold bg-white border-2 border-brand-100 text-brand-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm">
                Buy Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
