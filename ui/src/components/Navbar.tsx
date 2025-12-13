import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";
import { Home, Ticket, Wallet, User, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext"; // Import Hook

export function Navbar() {
  const location = useLocation();
  const { items, setIsOpen } = useCart(); // Get cart data
  
  const isActive = (path: string) => location.pathname === path ? "text-brand-600 bg-brand-50" : "text-gray-500 hover:text-gray-900";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-brand-600 tracking-tight flex items-center gap-2">
        Ticket<span className="text-gray-900">Hub</span>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive("/")}`}>
          <Home size={18} /> Events
        </Link>
        <Link to="/tickets" className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive("/tickets")}`}>
          <Ticket size={18} /> My Tickets
        </Link>
        <Link to="/wallet" className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive("/wallet")}`}>
          <Wallet size={18} /> Wallet
        </Link>
        <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive("/profile")}`}>
          <User size={18} /> Profile
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* CART BUTTON */}
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-500 hover:text-brand-600 transition-colors relative"
        >
          <ShoppingCart size={20} />
          {items.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>

        <div className="[&>button]:!bg-brand-600 [&>button]:!text-white [&>button]:!rounded-full [&>button]:!font-semibold [&>button]:!px-6">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
