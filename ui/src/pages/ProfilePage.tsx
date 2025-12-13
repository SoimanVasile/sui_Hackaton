import { useCurrentAccount } from "@mysten/dapp-kit";
import { useUserTickets } from "../hooks/useUserTickets";
import { Loader2, Ticket, Medal } from "lucide-react";

export function ProfilePage() {
  const account = useCurrentAccount();
  const { tickets, isLoading } = useUserTickets();

  const getBadgeStyle = (tier: string = "") => {
    if (tier.includes("Gold")) return "bg-yellow-50 border-yellow-200 text-yellow-800 ring-yellow-100";
    if (tier.includes("Silver")) return "bg-slate-50 border-slate-200 text-slate-800 ring-slate-100";
    return "bg-orange-50 border-orange-200 text-orange-800 ring-orange-100";
  };

  if (!account) return <div className="text-center py-20">Please connect wallet.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          W
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="font-mono text-gray-500 bg-gray-50 px-3 py-1 mt-2 rounded border inline-block break-all">
            {account.address}
          </p>
        </div>
      </div>

      <div className="space-y-10">
        
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Medal className="text-yellow-500" /> Donation Badges
          </h2>
          {isLoading ? <Loader2 className="animate-spin" /> : (
             <div className="grid md:grid-cols-2 gap-4">
               {tickets.filter(t => t.type === "Badge").map((badge) => (
                 <div key={badge.id} className={`p-4 rounded-xl border-2 flex gap-4 items-center shadow-sm relative overflow-hidden ${getBadgeStyle(badge.tier)}`}>
                   <img src={badge.image} alt="Badge" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white" />
                   <div>
                     <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                       {badge.tier || "Supporter"}
                     </span>
                     <h3 className="font-bold text-lg leading-tight">Charity Supporter</h3>
                     <p className="text-sm font-medium mt-1">Donated: {badge.amount} SUI</p>
                   </div>
                   <div className="absolute -top-10 -right-10 w-20 h-20 bg-white opacity-20 rotate-45 transform"></div>
                 </div>
               ))}
               {tickets.filter(t => t.type === "Badge").length === 0 && (
                 <p className="text-gray-400 italic">No badges yet. Donate to a campaign to earn one!</p>
               )}
             </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Ticket className="text-brand-600" /> Event Tickets
          </h2>
          <div className="grid gap-4">
            {tickets.filter(t => t.type === "Ticket").map((ticket) => (
              <div key={ticket.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                <img src={ticket.image} alt={ticket.name} className="w-24 h-24 rounded-lg object-cover bg-gray-100" />
                <div>
                  <h3 className="font-bold text-lg">{ticket.name}</h3>
                  <p className="text-sm text-gray-500">{ticket.description}</p>
                  <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                    Valid Ticket
                  </span>
                </div>
              </div>
            ))}
             {tickets.filter(t => t.type === "Ticket").length === 0 && !isLoading && (
                 <p className="text-gray-400 italic">No tickets found.</p>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
