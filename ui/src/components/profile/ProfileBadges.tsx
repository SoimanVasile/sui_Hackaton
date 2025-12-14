import { Loader2, Medal } from "lucide-react";
import { Item } from "../../hooks/useUserTickets";


interface ProfileBadgesProps {
  badges: Item[];
  isLoading: boolean;
}

export function ProfileBadges({ badges, isLoading }: ProfileBadgesProps) {
  
  const getBadgeStyle = (tier: string = "") => {
    if (tier.includes("Gold")) return "bg-yellow-50 border-yellow-200 text-yellow-800 ring-yellow-100";
    if (tier.includes("Silver")) return "bg-slate-50 border-slate-200 text-slate-800 ring-slate-100";
    return "bg-orange-50 border-orange-200 text-orange-800 ring-orange-100";
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Medal className="text-yellow-500" /> Donation Badges
      </h2>
      
      {isLoading ? <Loader2 className="animate-spin" /> : (
         <div className="grid md:grid-cols-2 gap-4">
           {badges.map((badge) => (
             <div key={badge.id} className={`p-4 rounded-xl border-2 flex gap-4 items-center shadow-sm relative overflow-hidden ${getBadgeStyle(badge.tier)}`}>
               <img src={badge.image} alt="Badge" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white" />
               <div>
                 <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                   {badge.tier || "Supporter"}
                 </span>
                 <h3 className="font-bold text-lg leading-tight">{badge.name}</h3>
                 <p className="text-sm font-medium mt-1">Donated: {badge.amount} SUI</p>
               </div>
             </div>
           ))}
           {badges.length === 0 && (
             <p className="text-gray-400 italic">No badges yet. Donate to a campaign to earn one!</p>
           )}
         </div>
      )}
    </div>
  );
}
