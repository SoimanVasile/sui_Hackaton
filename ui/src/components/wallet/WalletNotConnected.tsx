import { AlertCircle } from "lucide-react";


export function WalletNotConnected() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="bg-white rounded-3xl p-10 shadow-card inline-block border border-red-100">
        <AlertCircle className="w-16 h-16 text-brand-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
        <p className="text-gray-500">Please connect your Sui wallet using the button in the navbar.</p>
      </div>
    </div>
  );
}
