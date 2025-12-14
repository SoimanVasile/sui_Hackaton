import { useState } from "react";
import { Copy } from "lucide-react";


interface AddressBoxProps {
  address: string;
}

export function AddressBox({ address }: AddressBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100 mb-6">
      <div className="text-left overflow-hidden">
        <div className="text-xs text-gray-400 font-bold uppercase">Your Wallet Address</div>
        <div className="text-sm font-mono text-gray-800 truncate w-48 md:w-64">
          {address}
        </div>
      </div>
      <button 
        onClick={handleCopy}
        className="bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-100 transition-colors text-brand-600 active:scale-95"
        title="Copy Address"
      >
        {copied ? (
          <span className="text-xs font-bold text-green-600">Copied!</span>
        ) : (
          <Copy size={18} />
        )}
      </button>
    </div>
  );
}
