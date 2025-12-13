import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { EventsPage } from "./pages/EventsPage";
import { MyTicketsPage } from "./pages/MyTicketsPage";
import { WalletPage } from "./pages/WalletPage";
import { ProfilePage } from "./pages/ProfilePage";

import { CartDrawer } from "./components/cart/CartDrawer";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
        <Navbar />
        
        <CartDrawer />

        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/tickets" element={<MyTicketsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
