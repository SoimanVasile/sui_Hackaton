import { Search, X } from "lucide-react";

interface EventFiltersProps {
  activeFilter: string;
  searchQuery: string;
  onFilterChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export function EventFilters({ activeFilter, searchQuery, onFilterChange, onSearchChange }: EventFiltersProps) {
  const categories = ["All", "Music", "Sports", "Theater", "Comedy", "Conference"];

  return (
    <>
      <div className="group bg-white p-2 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50/50 transition-all duration-300 mb-8 flex items-center gap-3">
        
        <Search 
          className="ml-3 text-gray-400 group-focus-within:text-brand-500 transition-colors" 
          size={22} 
        />
        
        {/* The Input Field */}
        <input 
          type="text" 
          value={searchQuery}
          placeholder="Search events, locations, or artists..." 
          className="flex-1 py-3 outline-none text-gray-700 bg-transparent placeholder:text-gray-400 text-lg"
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {searchQuery && (
          <button 
            onClick={() => onSearchChange("")}
            className="p-2 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all animate-in fade-in zoom-in-95 duration-200"
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => onFilterChange(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
              activeFilter === cat 
                ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200 scale-105' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </>
  );
}
