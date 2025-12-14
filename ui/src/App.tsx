import { ConnectButton } from "@mysten/dapp-kit";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";

import { Cart } from "./components/cart/Cart"; 

import { EventsPage } from "./pages/EventsPage";
import { WalletPage } from "./pages/WalletPage";
import { OrganizerPage } from "./pages/OrganizerPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ValidatorPage } from "./pages/ValidatorPage";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 pb-20 relative">
          
          <Navbar />
          
          <Cart /> 

          <div className="pt-24 px-4 max-w-7xl mx-auto">
            <div className="flex justify-end mb-6">
            </div>
            
            <Routes>
              <Route path="/" element={<Navigate to="/events" replace />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/organizer" element={<OrganizerPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/validator" element={<ValidatorPage />} /> 
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
