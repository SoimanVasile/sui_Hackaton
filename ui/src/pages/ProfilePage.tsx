import { ProfileHeader } from "../components/ProfileHeader";
import { StatsGrid } from "../components/StatsGrid";

export function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <ProfileHeader />
      <StatsGrid />
    </div>
  );
}
