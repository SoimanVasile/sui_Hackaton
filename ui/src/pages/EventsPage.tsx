import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, FUNCTION_NAME } from "../constants";

import { useEvents } from "../hooks/useEvents";
import { EventFilters } from "../components/events/EventFilters";
import { EventGrid } from "../components/events/EventGrid";

export function EventsPage() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const { events, isLoading } = useEvents();
  
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<number | string | null>(null);

  // --- SMART CONTRACT LOGIC ---
  const handlePurchase = (event: any) => {
    if (!account) { alert("Please connect wallet first"); return; }
    
    setProcessingId(event.id);

    const tx = new Transaction();
    const amountInMist = event.price * 1_000_000_000; 

    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);

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

  // --- FILTERING LOGIC ---
  const filteredEvents = events.filter(evt => {
    const matchesCategory = activeFilter === "All" || evt.category === activeFilter;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.loc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* 1. Filter Section */}
      <EventFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Grid Section */}
      <EventGrid 
        events={filteredEvents}
        isLoading={isLoading}
        onBuy={handlePurchase}
        processingId={processingId}
      />
      
    </div>
  );
}
