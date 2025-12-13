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
      <div className="h-40 bg-gradient-to-r from-brand-600 to-purple-400 relative"></div>
      
      <div className="px-8 pb-8">
        <div className="flex justify-between items-end -mt-16 mb-6">
           
           <AvatarSection 
             isEditing={isEditing}
             avatar={avatar}
             onAvatarChange={onAvatarChange}
           />

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
