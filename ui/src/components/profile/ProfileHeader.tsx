import { useRef } from "react";
import { User, Edit2, Save, X, Camera } from "lucide-react";

interface Profile {
  username: string;
  bio: string;
  avatarUrl: string;
}

interface ProfileHeaderProps {
  accountAddress?: string;
  profile: Profile;
  setProfile: (p: Profile) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onSave: () => void;
}

export function ProfileHeader({ 
  accountAddress, profile, setProfile, isEditing, setIsEditing, onSave 
}: ProfileHeaderProps) {
  
  // Ref to trigger the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Upload (Convert to Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Optional: Check file size (limit to ~2MB to respect LocalStorage limits)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large! Please choose an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Save the Base64 string to the profile state
        setProfile({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 relative group">
      
      {/* Edit / Save Actions */}
      {!isEditing ? (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
          title="Edit Profile"
        >
          <Edit2 size={20} />
        </button>
      ) : (
        <div className="absolute top-6 right-6 flex gap-2">
          <button 
            onClick={() => setIsEditing(false)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <button 
            onClick={onSave}
            className="p-2 text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
          >
            <Save size={20} />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Avatar Section */}
        <div className="relative flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center relative">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="bg-gradient-to-br from-brand-500 to-purple-600 w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Overlay for Upload (Only in Edit Mode) */}
            {isEditing && (
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors backdrop-blur-[1px]"
                onClick={() => fileInputRef.current?.click()}
                title="Change Profile Picture"
              >
                <Camera className="text-white w-8 h-8 opacity-90" />
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />

          {isEditing && (
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="text-xs text-brand-600 font-bold mt-3 hover:underline"
             >
               Change Photo
             </button>
          )}
        </div>

        {/* Info Fields */}
        <div className="flex-1 text-center md:text-left space-y-2 w-full">
          {isEditing ? (
            <div className="space-y-3 max-w-md mx-auto md:mx-0">
              <input 
                type="text" 
                value={profile.username}
                onChange={e => setProfile({...profile, username: e.target.value})}
                className="w-full text-3xl font-bold text-gray-900 border-b-2 border-brand-100 focus:border-brand-500 outline-none bg-transparent placeholder-gray-300"
                placeholder="Display Name"
              />
              <textarea 
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full text-gray-500 border rounded-lg p-2 focus:ring-2 focus:ring-brand-100 outline-none text-sm resize-none bg-gray-50"
                placeholder="Tell us about yourself..."
                rows={2}
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
              <p className="text-gray-500 max-w-lg mx-auto md:mx-0">{profile.bio}</p>
              <div className="font-mono text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border inline-flex items-center gap-2 mt-2">
                <User size={12} />
                {accountAddress?.slice(0, 6)}...{accountAddress?.slice(-4)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
