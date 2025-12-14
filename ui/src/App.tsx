import { ConnectButton } from "@mysten/dapp-kit";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";

// CRITICAL: Ensure this import points to your actual file
import { Cart } from "./components/cart/Cart"; 

import { EventsPage } from "./pages/EventsPage";
import { WalletPage } from "./pages/WalletPage";
import { OrganizerPage } from "./pages/OrganizerPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ValidatorPage } from "./pages/ValidatorPage"; // ✅ Added Import

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 pb-20 relative">
          
          <Navbar />
          
          {/* CRITICAL: The Cart must be rendered here! */}
          <Cart /> 

          <div className="pt-24 px-4 max-w-7xl mx-auto">
            {/* Wrapper for Connect Button to position it consistently */}
            <div className="flex justify-end mb-6">
              {/* Note: Navbar usually handles ConnectButton, but we keep this container if needed for layout */}
            </div>
            
            <Routes>
              <Route path="/" element={<Navigate to="/events" replace />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/organizer" element={<OrganizerPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* ✅ Added Validator Route */}
              <Route path="/validator" element={<ValidatorPage />} /> 
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
