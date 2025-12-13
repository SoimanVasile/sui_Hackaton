import { Link } from "react-router-dom";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext"; 
import { ORGANIZER_ADDRESS } from "../constants";

export function Navbar() {
  const account = useCurrentAccount();
  const { toggleCart, items } = useCart(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isOrganizer = account?.address === ORGANIZER_ADDRESS;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600">
              SuiCharity
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/events" className="text-gray-500 hover:text-brand-600 font-medium transition-colors">
              Events
            </Link>
            
            {isOrganizer && (
              <Link to="/organizer" className="text-brand-600 font-bold hover:text-brand-700 transition-colors bg-brand-50 px-3 py-1 rounded-lg">
                Organizer Panel
              </Link>
            )}

            {account && (
              <>
                <Link to="/wallet" className="text-gray-500 hover:text-brand-600 font-medium transition-colors">
                  Wallet
                </Link>
                <Link to="/profile" className="text-gray-500 hover:text-brand-600 font-medium transition-colors">
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ConnectButton />
            <button 
              onClick={toggleCart} 
              className="relative p-2 text-gray-400 hover:text-brand-600 transition-colors bg-gray-50 hover:bg-brand-50 rounded-full"
            >
              <ShoppingBag size={24} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white transform translate-x-1 -translate-y-1">
                  {items.length}
                </span>
              )}
            </button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-500">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
          <Link to="/events" className="block text-gray-600 font-medium">Events</Link>
          {isOrganizer && (
             <Link to="/organizer" className="block text-brand-600 font-bold">Organizer Panel</Link>
          )}
          <button onClick={toggleCart} className="flex items-center gap-2 text-brand-600 font-bold w-full">
            <ShoppingBag size={20} /> Cart ({items.length})
          </button>
        </div>
      )}
    </nav>
  );
}
