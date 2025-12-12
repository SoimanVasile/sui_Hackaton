import { AvatarSection } from "./AvatarSection";
import { ProfileActions } from "./ProfileActions";

interface ProfileBannerProps {
  isEditing: boolean;
  avatar: string;
  onAvatarChange: (newUrl: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileBanner({ isEditing, avatar, onAvatarChange, onEdit, onSave, onCancel }: ProfileBannerProps) {
  return (
    <>
      {/* 1. Background Gradient */}
      <div className="h-40 bg-gradient-to-r from-brand-600 to-purple-400 relative"></div>
      
      {/* 2. Content Container */}
      <div className="px-8 pb-8">
        <div className="flex justify-between items-end -mt-16 mb-6">
           
           {/* 3. The Avatar Component */}
           <AvatarSection 
             isEditing={isEditing}
             avatar={avatar}
             onAvatarChange={onAvatarChange}
           />

           {/* 4. The Buttons Component */}
           <ProfileActions 
             isEditing={isEditing} 
             onEdit={onEdit} 
             onSave={onSave} 
             onCancel={onCancel}
           />

        </div>
      </div>
    </>
  );
}
