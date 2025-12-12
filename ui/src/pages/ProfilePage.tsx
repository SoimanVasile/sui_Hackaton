import { ProfileHeader } from "../components/ProfileHeader";
import { StatsGrid } from "../components/StatsGrid";
import { useUserTickets } from "../hooks/useUserTickets"; 

export function ProfilePage() {
  const { tickets } = useUserTickets();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <ProfileHeader />
      
      <StatsGrid tickets={tickets} />
    </div>
  );
}
