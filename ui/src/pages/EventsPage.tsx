import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Search } from "lucide-react";
import { PACKAGE_ID, MODULE_NAME, FUNCTION_NAME } from "../constants";

// Imports from our new modules
import { useEvents } from "../hooks/useEvents";
import { EventCard } from "../components/events/EventCard";

export function EventsPage() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const { events, isLoading } = useEvents(); // Using our Hook
  
  const [activeFilter, setActiveFilter] = useState("All");
  const [processingId, setProcessingId] = useState<number | string | null>(null);

  // --- THE REAL TRANSACTION LOGIC ---
  const handlePurchase = (event: any) => {
    if (!account) { alert("Please connect wallet first"); return; }
    
    setProcessingId(event.id); // Show loading state on button

    const tx = new Transaction();
    // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
    const amountInMist = event.price * 1_000_000_000; 

    // Create a coin of the exact amount from your gas
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);

    // Call the Smart Contract
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [coin],
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: (res) => {
        alert(`Successfully bought ticket! Digest: ${res.digest}`);
        setProcessingId(null);
      },
      onError: (err) => {
        console.error("Purchase failed", err);
        setProcessingId(null);
      }
    });
  };

  // Filter Logic
  const filteredEvents = activeFilter === "All" 
    ? events 
    : events.filter(e => e.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <Search className="text-gray-400 ml-4" size={20} />
        <input 
          type="text" 
          placeholder="Search events or locations..." 
          className="flex-1 py-3 outline-none text-gray-700"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
        {["All", "Music", "Sports", "Theater", "Comedy", "Conference"].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === cat 
                ? 'bg-brand-600 text-white shadow-glow' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading events...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(evt => (
            <EventCard 
              key={evt.id} 
              event={evt} 
              onBuy={handlePurchase}
              isProcessing={processingId === evt.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
