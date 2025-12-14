import { X, QrCode as QrIcon } from "lucide-react";
import { QrSection } from "./topup/QrSection";
import { AddressBox } from "./topup/AddressBox";
import { FaucetLink } from "./topup/FaucetLink";


interface TopUpModalProps {
  address: string;
  onClose: () => void;
}

export function TopUpModal({ address, onClose }: TopUpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="bg-brand-600 p-6 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <QrIcon size={20} /> Deposit SUI
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 text-center">
          <QrSection address={address} />
          <AddressBox address={address} />
          <FaucetLink />
        </div>

      </div>
    </div>
  );
}
