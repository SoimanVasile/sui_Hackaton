import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Home, Ticket, Wallet, User, ShoppingCart, Search, MapPin, Calendar, Download, QrCode, Plus, TrendingUp, TrendingDown, Edit3 } from "lucide-react";

// REPLACE THIS WITH YOUR PACKAGE ID
const PACKAGE_ID = "0x..."; 
const MODULE_NAME = "charity";
const FUNCTION_NAME = "donate_for_cause";

const EVENTS = [
  { id: 1, title: "Summer Music Festival 2025", date: "Jul 15, 2025 at 18:00", loc: "Main Stage Arena", price: 10, category: "Music", img: "https://images.unsplash.com/photo-1459749411177-2a2965bda362?w=800&q=80" },
  { id: 2, title: "Championship Finals", date: "Aug 20, 2025 at 19:30", loc: "Metro Sports Stadium", price: 25, category: "Sports", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
  { id: 3, title: "Broadway Night: The Musical", date: "Jun 30, 2025 at 20:00", loc: "Royal Theater", price: 15, category: "Theater", img: "https://images.unsplash.com/photo-1503095392269-27528ca388ec?w=800&q=80" },
];

const MY_TICKETS = [
  { id: 101, title: "Broadway Night: The Musical", date: "Jun 30, 2025", loc: "Royal Theater", category: "Theater", status: "Upcoming", img: "https://images.unsplash.com/photo-1503095392269-27528ca388ec?w=800&q=80" }
];

function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-brand-600 bg-brand-50" : "text-gray-500 hover:text-gray-900";
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-brand-600 tracking-tight flex items-center gap-2">Ticket<span className="text-gray-900">Hub</span></div>
      <div className="hidden md:flex items-center gap-2">
        <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive("/")}`}><Home size={18} /> Events</Link>
        <Link to="/tickets" className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive("/tickets")}`}><Ticket size={18} /> My Tickets</Link>
        <Link to="/wallet" className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive("/wallet")}`}><Wallet size={18} /> Wallet</Link>
        <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive("/profile")}`}><User size={18} /> Profile</Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-brand-600 transition-colors"><ShoppingCart size={20} /></button>
        <div className="[&>button]:!bg-brand-600 [&>button]:!text-white [&>button]:!rounded-full [&>button]:!font-semibold [&>button]:!px-6"><ConnectButton /></div>
      </div>
    </nav>
  );
}

function EventsPage() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const [activeFilter, setActiveFilter] = useState("All");

  const handlePurchase = (event: any) => {
    if (!account) { alert("Please connect wallet first"); return; }
    const tx = new Transaction();
    const amountInMist = event.price * 1_000_000_000; 
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);
    tx.moveCall({ target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`, arguments: [coin] });
    signAndExecute({ transaction: tx }, {
      onSuccess: (res) => alert(`Successfully bought ticket! Digest: ${res.digest}`),
      onError: (err) => console.error("Purchase failed", err)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <Search className="text-gray-400 ml-4" size={20} /><input type="text" placeholder="Search events or locations..." className="flex-1 py-3 outline-none text-gray-700"/>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-6">
        {["All", "Music", "Sports", "Theater", "Comedy", "Conference"].map((cat) => (
          <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeFilter === cat ? 'bg-brand-600 text-white shadow-glow' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'}`}>{cat}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EVENTS.map(evt => (
          <div key={evt.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-card hover:shadow-xl transition-all group">
            <div className="relative h-56 overflow-hidden"><img src={evt.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={evt.title} /><div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-brand-700 shadow-sm">{evt.price} SUI</div></div>
            <div className="p-6"><span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold uppercase mb-3">{evt.category}</span><h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{evt.title}</h3>
              <div className="space-y-2 text-sm text-gray-500 mb-6"><div className="flex items-center gap-2"><Calendar size={16} className="text-brand-500"/> {evt.date}</div><div className="flex items-center gap-2"><MapPin size={16} className="text-brand-500"/> {evt.loc}</div></div>
              <button onClick={() => handlePurchase(evt)} className="w-full py-3.5 rounded-xl font-bold bg-white border-2 border-brand-100 text-brand-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm">Buy Ticket</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyTicketsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Tickets</h2>
      {MY_TICKETS.map(ticket => (
        <div key={ticket.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8 shadow-card mb-6">
          <img src={ticket.img} className="w-full md:w-56 h-36 object-cover rounded-xl" alt="Ticket" />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3"><span className="px-3 py-1 bg-purple-50 text-brand-600 rounded-full text-xs font-bold uppercase">{ticket.category}</span><span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase">{ticket.status}</span></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h3>
              <div className="text-gray-500 text-sm flex gap-6"><span className="flex items-center gap-1"><Calendar size={14}/> {ticket.date}</span><span className="flex items-center gap-1"><MapPin size={14}/> {ticket.loc}</span></div>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0">
              <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"><QrCode size={18}/> View QR</button>
              <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"><Download size={18}/> PDF</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WalletPage() {
  const account = useCurrentAccount();
  const { data: balance } = useSuiClientQuery('getBalance', { owner: account?.address || '' });
  const suiBalance = balance ? (parseInt(balance.totalBalance) / 1_000_000_000).toFixed(2) : "0.00";
  const usdValue = (parseFloat(suiBalance) * 1.5).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-gradient-to-r from-brand-600 to-purple-500 rounded-3xl p-10 text-white shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8"><div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10"><Wallet size={16}/> Wallet Balance</div><button className="bg-white text-brand-600 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"><Plus size={18}/> Top Up</button></div>
          <div className="mb-2"><span className="text-6xl font-bold tracking-tight">{suiBalance}</span><span className="text-2xl font-medium opacity-80 ml-2">SUI</span></div>
          <div className="opacity-80 text-lg font-medium">≈ ${usdValue} USD</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5"><div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500"><TrendingDown size={28}/></div><div><div className="text-gray-400 text-sm font-medium mb-1">Total Spent</div><div className="text-2xl font-bold text-gray-900">$190.00</div></div></div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5"><div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500"><TrendingUp size={28}/></div><div><div className="text-gray-400 text-sm font-medium mb-1">Total Top-ups</div><div className="text-2xl font-bold text-gray-900">$300.00</div></div></div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const account = useCurrentAccount();
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-brand-600 to-purple-400"></div>
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-16 mb-6"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" alt="Profile" /><button className="bg-brand-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"><Edit3 size={18}/> Edit Profile</button></div>
          <h1 className="text-3xl font-bold text-gray-900">Alex Johnson</h1>
          <p className="text-gray-500 font-medium mt-1">{account?.address || "Connect wallet to see address"}</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
        <Navbar />
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
