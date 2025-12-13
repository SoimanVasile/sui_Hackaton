import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import { EventFilters } from "../components/events/EventFilters";
import { EventGrid } from "../components/events/EventGrid";
import { useCart } from "../context/CartContext"; // Import Cart Hook

export function EventsPage() {
  const { events, isLoading } = useEvents();
  const { addToCart } = useCart(); // Get the add function
  
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Logic: Just add to cart (The CartDrawer will open automatically)
  const handleAddToCart = (event: any) => {
    addToCart(event);
  };

  const filteredEvents = events.filter(evt => {
    const matchesCategory = activeFilter === "All" || evt.category === activeFilter;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.loc.toLowerCase().includes(searchQuery.toLowerCase());
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
        isLoading={isLoading}
        onAdd={handleAddToCart} // Pass the cart logic
      />
      
    </div>
  );
}
