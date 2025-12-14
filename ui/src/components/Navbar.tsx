import { Link, useLocation } from "react-router-dom"; 
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Ticket, Wallet, User, Calendar, LayoutGrid, ShoppingBag } from "lucide-react";
import { ORGANIZER_ADDRESS } from "../constants";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const account = useCurrentAccount();
  const { toggleCart, items } = useCart();
  const isOrganizer = account?.address === ORGANIZER_ADDRESS;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 flex items-center justify-between">
      
      <Link to="/" className="flex items-center gap-2 group">
        <img 
          src="/LOGO.png" 
          alt="NFPass Logo" 
          className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" 
        />
        <span className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          NFPass
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
        <NavLink to="/events" icon={<Calendar size={18} />} label="Events" />
        <NavLink to="/wallet" icon={<Wallet size={18} />} label="Wallet" />
        <NavLink to="/profile" icon={<User size={18} />} label="Profile" />

        {isOrganizer && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <NavLink to="/organizer" icon={<LayoutGrid size={18} />} label="Organizer" />
            <NavLink to="/validator" icon={<Ticket size={18} />} label="Scanner" />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        
        <button 
          onClick={toggleCart}
          className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors border border-transparent hover:border-gray-200"
          title="Open Cart"
        >
          <ShoppingBag size={20} />
          
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1 shadow-sm">
              {totalItems}
            </span>
          )}
        </button>

        <ConnectButton />
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
        isActive 
          ? "bg-white text-brand-600 shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
