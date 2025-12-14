import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import { useCampaigns } from "../hooks/useCampaigns"; 
import { useLiveEvents } from "../hooks/useLiveEvents";
import { useUserTickets } from "../hooks/useUserTickets";
import { EventFilters } from "../components/events/EventFilters";
import { EventGrid } from "../components/events/EventGrid";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../constants";
import { useCart } from "../context/CartContext"; // ✅ 1. Import useCart

export function EventsPage() {
  const { events: staticEvents, isLoading: isStaticLoading } = useEvents();
  const { campaigns: liveCampaigns, isLoading: isLiveLoading } = useCampaigns();
  const { liveEvents, isLoading: isLiveEventsLoading } = useLiveEvents();
  const { tickets: userItems } = useUserTickets(); 

  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { addToCart } = useCart(); // ✅ 2. Get addToCart function

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAction = (event: any) => {
    // We allow adding to cart even without wallet connected (optional)
    // or you can keep the check: if (!account) return alert("Please connect wallet.");

    if (event.isCampaign) {
      handleDonate(event);
    } else {
      handleBuyTicket(event);
    }
  };

  // ✅ 3. MODIFIED: Add to Cart instead of buying instantly
  const handleBuyTicket = (event: any) => {
    addToCart({
      id: event.id,
      title: event.title,
      price: event.price,
      img: event.img,
      category: event.category,
      quantity: 1
    });
    // Optional: Add a toast notification here
    // alert(`${event.title} added to cart!`); 
  };

  // Note: Donations remain instant because they require a custom amount input
  const handleDonate = (campaign: any) => {
    if (!account) return alert("Please connect wallet to donate.");

    const amountStr = prompt(`Donate to ${campaign.title}? (SUI)`);
    if (!amountStr || isNaN(Number(amountStr)) || Number(amountStr) <= 0) return;

    const amountMist = BigInt(Math.floor(parseFloat(amountStr) * 1_000_000_000));
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

    const existingBadge = userItems.find((item: any) => 
        item.campaignId === campaign.id || item.name === campaign.title
    );

    if (existingBadge) {
        tx.moveCall({
            target: `${PACKAGE_ID}::charity::donate_update`,
            arguments: [
                tx.object(campaign.id),      
                tx.object(existingBadge.id), 
                coin,                        
            ],
        });
    } else {
        tx.moveCall({
            target: `${PACKAGE_ID}::charity::donate`,
            arguments: [
                tx.object(campaign.id),
                coin,
            ],
        });
    }

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => alert("Donation successful!"),
        onError: (err) => { console.error(err); alert("Donation failed."); }
      }
    );
  };

  // --- DATA MERGING ---
  
  const formattedCampaigns = liveCampaigns.map(c => ({
    ...c, 
    category: "Charity", 
    date: `Goal: ${c.targetAmount} SUI`, 
    loc: `Raised: ${c.currentRaised} SUI`,
    img: c.imageUrl, 
    isCampaign: true 
  }));

  const formattedLiveEvents = liveEvents.map(e => ({
    ...e,
    loc: e.location || "Online", 
    isCampaign: false 
  }));

  const allEvents = [...formattedLiveEvents, ...formattedCampaigns];

  const filteredEvents = allEvents.filter(evt => {
    const matchesCategory = activeFilter === "All" || evt.category === activeFilter;
    
    const title = evt.title || "";
    const location = evt.loc || "";
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          location.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <EventFilters 
        activeFilter={activeFilter}
        searchQuery={searchQuery}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearchQuery}
      />
      <EventGrid 
        events={filteredEvents}
        isLoading={isStaticLoading || isLiveLoading || isLiveEventsLoading} 
        onAdd={handleAction} 
      />
    </div>
  );
}
