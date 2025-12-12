interface ProfileData {
  name: string;
  bio: string;
  location: string;
}

interface ProfileInfoProps {
  isEditing: boolean;
  data: ProfileData;
  onChange: (field: keyof ProfileData, value: string) => void;
  walletAddress: string;
}

export function ProfileInfo({ isEditing, data, onChange, walletAddress }: ProfileInfoProps) {
  return (
    <div className="px-8 pb-8 space-y-4">
      {/* Name Field */}
      <div>
        {isEditing ? (
          <input 
            type="text" 
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="text-3xl font-bold text-gray-900 w-full border-b-2 border-brand-200 focus:border-brand-500 outline-none pb-1"
          />
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
        )}
        <p className="text-gray-500 font-medium mt-1">{walletAddress}</p>
      </div>

      {/* Bio Field */}
      <div>
        {isEditing ? (
          <textarea 
            value={data.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-brand-500 outline-none min-h-[100px]"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-gray-600 max-w-2xl leading-relaxed">{data.bio}</p>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="flex gap-8 text-sm font-medium text-gray-500 border-t border-gray-100 pt-6">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-gray-300 rounded-full"></div> 
           {isEditing ? (
             <input 
               value={data.location}
               onChange={(e) => onChange("location", e.target.value)}
               className="border-b border-gray-300 focus:border-brand-500 outline-none w-32"
             />
           ) : data.location}
         </div>
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-gray-300 rounded-full"></div> 
           Joined Jan 2024
         </div>
      </div>
    </div>
  );
}
