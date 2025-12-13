import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const MAX_SIZE = 100; 
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        
        if (compressedBase64.length > 15000) {
            alert("Imaginea este încă prea complexă. Încearcă o iconiță mai simplă.");
            return;
        }

        onChange(compressedBase64);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-3">Insignă Campanie (Auto-Redimensionare)</label>
      
      {!value ? (
        <div 
          className={`relative border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center transition-all cursor-pointer group
            ${dragActive ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Upload className="text-brand-600" size={20} />
          </div>
          <p className="text-gray-900 font-medium text-sm">Click pentru încărcare</p>
          <p className="text-xs text-gray-400 mt-1">Va fi redimensionată la 100px</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button onClick={() => onChange("")} className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
