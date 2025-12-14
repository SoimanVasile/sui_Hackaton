import { Edit3, Save, X } from "lucide-react";


interface ProfileActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileActions({ isEditing, onEdit, onSave, onCancel }: ProfileActionsProps) {
  return (
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
  );
}
