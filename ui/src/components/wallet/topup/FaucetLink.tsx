import { ExternalLink } from "lucide-react";


export function FaucetLink() {
  const FAUCET_URL = "https://faucet.sui.io/";

  return (
    <div className="border-t border-gray-100 pt-6">
      <p className="text-xs text-gray-400 mb-3">Don't have funds?</p>
      <a 
        href={FAUCET_URL}
        target="_blank" 
        rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
      >
        <ExternalLink size={16} /> Open Sui Faucet
      </a>
    </div>
  );
}
