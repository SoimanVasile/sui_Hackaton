import { TicketNFT } from "../../hooks/useUserTickets";

interface StatsGridProps {
  tickets: TicketNFT[];
}

export function StatsGrid({ tickets }: StatsGridProps) {
  
  // 1. Calculate Total Purchased (Real Wallet Count)
  const purchasedCount = tickets.length;

  // 2. Calculate Attended (Logic: Look for "Used" status in metadata)
  // Since standard NFTs might not have a status field, we check the description as a fallback.
  // In a real dApp, you would check a specific field on the Smart Contract.
  const attendedCount = tickets.filter(t => 
    t.description?.toLowerCase().includes("used") || 
    t.title.toLowerCase().includes("past")
  ).length;

  const stats = [
    { label: "Events Attended", val: attendedCount },
    { label: "Tickets Purchased", val: purchasedCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:-translate-y-1 transition-transform cursor-default">
          <div className="text-3xl font-bold text-brand-600 mb-1">{stat.val}</div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
