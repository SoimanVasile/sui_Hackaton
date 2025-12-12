import { Edit3, Save, X, Camera } from "lucide-react";

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
           {/* Avatar Circle */}
           <div className="relative group">
             <img 
               src={avatar} 
               className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-gray-100" 
               alt="Profile" 
               onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"} 
             />
             
             {/* Edit Overlay */}
             {isEditing && (
               <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent">
                 <Camera className="text-white" size={24} />
                 <input 
                    type="text" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Paste Image URL"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent file dialog
                      const url = prompt("Paste new Image URL:");
                      if(url) onAvatarChange(url);
                    }}
                 />
               </div>
             )}
           </div>

           {/* Action Buttons */}
           <div className="flex gap-2">
             {isEditing ? (
               <>
                 <button onClick={onCancel} className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                   <X size={18}/> Cancel
                 </button>
                 <button onClick={onSave} className="bg-green-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg">
                   <Save size={18}/> Save
                 </button>
               </>
             ) : (
               <button onClick={onEdit} className="bg-brand-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
                 <Edit3 size={18}/> Edit Profile
               </button>
             )}
           </div>
        </div>
      </div>
    </>
  );
}
