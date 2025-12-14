import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useUserTickets } from "../hooks/useUserTickets";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileBadges } from "../components/profile/ProfileBadges";
import { ProfileTickets } from "../components/profile/ProfileTickets";

export function ProfilePage() {
  const account = useCurrentAccount();
  const { tickets, isLoading } = useUserTickets();

  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "Unnamed User",
    bio: "New to the Sui ecosystem!",
    avatarUrl: ""
  });

  // Load from Local Storage
  useEffect(() => {
    if (account?.address) {
      const savedProfile = localStorage.getItem(`user_profile_${account.address}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [account]);

  // Save to Local Storage
  const handleSave = () => {
    if (account?.address) {
      localStorage.setItem(`user_profile_${account.address}`, JSON.stringify(profile));
      setIsEditing(false);
    }
  };

  if (!account) return <div className="text-center py-20">Please connect wallet.</div>;

  // Filter Data
  const badges = tickets.filter(t => t.type === "Badge");
  const eventTickets = tickets.filter(t => t.type === "Ticket");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      <ProfileHeader 
        accountAddress={account.address}
        profile={profile}
        setProfile={setProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleSave}
      />

      <div className="space-y-10">
        <ProfileBadges badges={badges} isLoading={isLoading} />
        <ProfileTickets tickets={eventTickets} isLoading={isLoading} />
      </div>
      
    </div>
  );
}
