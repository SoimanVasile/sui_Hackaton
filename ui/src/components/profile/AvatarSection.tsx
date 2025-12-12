import { Camera } from "lucide-react";

interface AvatarSectionProps {
  isEditing: boolean;
  avatar: string;
  onAvatarChange: (newUrl: string) => void;
}

export function AvatarSection({ isEditing, avatar, onAvatarChange }: AvatarSectionProps) {
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large! Please upload a photo smaller than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onAvatarChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group">
      <img 
        src={avatar} 
        className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-gray-100" 
        alt="Profile" 
        onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"} 
      />
      
      {/* Upload Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent">
          <Camera className="text-white" size={24} />
          <input 
             type="file" 
             accept="image/*"
             className="absolute inset-0 opacity-0 cursor-pointer"
             title="Upload new photo"
             onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
}
