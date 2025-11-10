import { Video, MapPin, Smile, Image as ImageIcon } from "lucide-react";

type QuickActionsProps = {
  onImageSelect?: (file: File) => void;
  onVideoClick?: () => void;
  onLocationClick?: () => void;
  onEmojiClick?: () => void;
};

export default function QuickActions({
  onImageSelect,
  onVideoClick,
  onLocationClick,
  onEmojiClick,
}: QuickActionsProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer">
          <ImageIcon size={24} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Foto</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <button
          onClick={onVideoClick}
          className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
        >
          <Video size={24} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Video</span>
        </button>

        <button
          onClick={onLocationClick}
          className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
        >
          <MapPin size={24} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Ubicación</span>
        </button>

        <button
          onClick={onEmojiClick}
          className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
        >
          <Smile size={24} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Emoji</span>
        </button>
      </div>
    </div>
  );
}
