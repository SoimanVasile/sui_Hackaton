import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ProfileBanner } from "./profile/ProfileBanner";
import { ProfileInfo } from "./profile/ProfileInfo";

export function ProfileHeader() {
  const account = useCurrentAccount();
  
  // Default Data
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    bio: "Music enthusiast and event lover. Always looking for the next great show! Collecting memories one ticket at a time.",
    location: "New York, NY",
    email: "alex.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
  });

  // Edit Mode Logic
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleEdit = () => { setTempProfile(profile); setIsEditing(true); };
  const handleSave = () => { setProfile(tempProfile); setIsEditing(false); };
  const handleCancel = () => { setIsEditing(false); };

  // Helper to update specific fields
  const handleInfoChange = (field: string, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden mb-8">
      {/* 1. The Banner Section */}
      <ProfileBanner 
        isEditing={isEditing}
        avatar={isEditing ? tempProfile.avatar : profile.avatar}
        onAvatarChange={(url) => setTempProfile(prev => ({ ...prev, avatar: url }))}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {/* 2. The Info Section */}
      <ProfileInfo 
        isEditing={isEditing}
        data={isEditing ? tempProfile : profile}
        onChange={handleInfoChange}
        walletAddress={account?.address || "Connect wallet to see address"}
      />
    </div>
  );
}
