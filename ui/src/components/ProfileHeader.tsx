import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ProfileBanner } from "./profile/ProfileBanner";
import { ProfileInfo } from "./profile/ProfileInfo";


export function ProfileHeader() {
  const account = useCurrentAccount();
  
  const defaultProfile = {
    name: "Enter a name...",
    bio: "Write a bio...",
    location: "Location",
    email: "Enter an email...",
    avatar: ""
  };

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("ticketHub_profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleEdit = () => { 
    setTempProfile(profile); 
    setIsEditing(true); 
  };

  const handleSave = () => { 
    setProfile(tempProfile); 
    
    localStorage.setItem("ticketHub_profile", JSON.stringify(tempProfile));
    
    setIsEditing(false); 
  };

  const handleCancel = () => { 
    setIsEditing(false); 
  };

  const handleInfoChange = (field: string, value: string) => {
    setTempProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden mb-8">
      <ProfileBanner 
        isEditing={isEditing}
        avatar={isEditing ? tempProfile.avatar : profile.avatar}
        onAvatarChange={(url) => setTempProfile((prev: any) => ({ ...prev, avatar: url }))}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <ProfileInfo 
        isEditing={isEditing}
        data={isEditing ? tempProfile : profile}
        onChange={handleInfoChange}
        walletAddress={account?.address || "Connect wallet to see address"}
      />
    </div>
  );
}
