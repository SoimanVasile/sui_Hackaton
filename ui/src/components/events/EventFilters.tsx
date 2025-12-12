import { Search } from "lucide-react";

interface EventFiltersProps {
  activeFilter: string;
  onFilterChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export function EventFilters({ activeFilter, onFilterChange, onSearchChange }: EventFiltersProps) {
  const categories = ["All", "Music", "Sports", "Theater", "Comedy", "Conference"];

  return (
    <>
      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <Search className="text-gray-400 ml-4" size={20} />
        <input 
          type="text" 
          placeholder="Search events or locations..." 
          className="flex-1 py-3 outline-none text-gray-700"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => onFilterChange(cat)}
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
    </>
  );
}
