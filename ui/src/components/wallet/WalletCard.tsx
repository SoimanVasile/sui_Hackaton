import { useState } from "react";
import { Wallet, Plus, QrCode, X, Copy, Check } from "lucide-react";
import QRCode from "react-qr-code"; // ⚠️ This requires the installation from Step 1
import { TopUpModal } from "./TopUpModal";

interface WalletCardProps {
  balanceSUI: number;
  balanceUSD: string;
  address: string;
  isPending: boolean;
}

export function WalletCard({ balanceSUI, balanceUSD, address, isPending }: WalletCardProps) {
  // --- STATE ---
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false); // Controls the QR Modal
  const [copied, setCopied] = useState(false);

  // --- HELPER: Copy Address ---
  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-brand-600 to-purple-500 rounded-3xl p-10 text-white shadow-2xl mb-8 relative overflow-hidden">
        {/* Decorative Background Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900 opacity-10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
        
        <div className="relative z-10">
          
          {/* --- HEADER: Wallet Label + Buttons --- */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              <Wallet size={16}/> Wallet Balance
            </div>
            
            <div className="flex gap-3">
                {/* 🟢 1. RECEIVE BUTTON (Opens QR) */}
                <button 
                  onClick={() => setIsQrOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all backdrop-blur-md border border-white/10 active:scale-95"
                >
                  <QrCode size={18}/> Receive
                </button>

                {/* 🔵 2. TOP UP BUTTON (Existing) */}
                <button 
                  onClick={() => setIsTopUpOpen(true)}
                  className="bg-white text-brand-600 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
                >
                  <Plus size={18}/> Top Up
                </button>
            </div>
          </div>
          
          {/* --- BALANCE SECTION --- */}
          <div className="mb-2">
            {isPending ? (
              <span className="text-4xl font-bold opacity-50">Loading...</span>
            ) : (
              <>
                <span className="text-6xl font-bold tracking-tight">{balanceSUI.toFixed(2)}</span>
                <span className="text-2xl font-medium opacity-80 ml-2">SUI</span>
              </>
            )}
          </div>
          <div className="opacity-80 text-lg font-medium">≈ ${balanceUSD} USD</div>
          
          {/* --- ADDRESS BAR (Bottom) --- */}
          <div className="mt-6 flex items-center gap-2">
            <div className="text-xs bg-black/20 inline-flex items-center px-3 py-1.5 rounded-lg font-mono text-white/80 border border-white/5">
                {address || "Please connect wallet"}
            </div>
            <button 
                onClick={copyToClipboard}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/90 border border-white/5"
                title="Copy Address"
            >
                {copied ? <Check size={14} className="text-green-300"/> : <Copy size={14}/>}
            </button>
          </div>
        </div>
      </div>

      {isTopUpOpen && (
        <TopUpModal 
          address={address} 
          onClose={() => setIsTopUpOpen(false)} 
        />
      )}

      {isQrOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsQrOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Receive Assets</h3>
            <p className="text-gray-500 mb-6 text-sm">Scan to send funds to this address</p>
            
            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl border-2 border-brand-100 inline-block mb-6 shadow-sm">
              <QRCode 
                value={address || ""} 
                size={200}
                viewBox={`0 0 256 256`}
              />
            </div>
            
            {/* Address Box */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between gap-3 text-left">
                <p className="font-mono text-xs text-gray-500 break-all leading-relaxed">
                    {address}
                </p>
                <button 
                    onClick={copyToClipboard}
                    className="p-2 bg-white rounded-lg shadow-sm text-gray-400 hover:text-brand-600 transition-colors shrink-0"
                >
                    {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                </button>
            </div>
            
            {copied && <p className="text-green-600 text-xs font-bold mt-2">Address Copied!</p>}

          </div>
        </div>
      )}
    </>
  );
}
