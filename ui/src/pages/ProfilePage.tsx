import { useCurrentAccount } from "@mysten/dapp-kit";
import { Edit3 } from "lucide-react";

export function ProfilePage() {
  const account = useCurrentAccount();
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-brand-600 to-purple-400"></div>
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-16 mb-6">
             <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" alt="Profile" />
             <button className="bg-brand-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
               <Edit3 size={18}/> Edit Profile
             </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Alex Johnson</h1>
          <p className="text-gray-500 font-medium mt-1">{account?.address || "Connect wallet to see address"}</p>
        </div>
      </div>
    </div>
  );
}
