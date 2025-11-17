import { useState } from "react";
import {
  Plus,
  X,
  Image as ImageIcon,
  Video,
  MapPin,
  Smile,
  Hash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";

type CreatePostFormProps = {
  onSubmit?: (data: {
    content: string;
    images: string[];
    location: string;
    tags: string[];
  }) => void;
  placeholder?: string;
  compact?: boolean;
  showAdvanced?: boolean;
};

export default function CreatePostForm({
  onSubmit,
  placeholder = "¿Qué quieres compartir con la comunidad?",
  compact = false,
  showAdvanced = true,
}: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(
        (file, index) =>
          `https://images.unsplash.com/photo-${1587300003388 + index}?w=600&h=400&fit=crop`
      );
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages(
      selectedImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = () => {
    onSubmit?.({
      content,
      images: selectedImages,
      location,
      tags,
    });
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://i.pravatar.cc/150?img=33" alt="Tu" />
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[80px] p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-gray-900"
            />
            <div className="flex justify-between items-center mt-3">
              <label className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <ImageIcon size={20} />
                <span className="text-sm">Imagen</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
      {/* User Info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://i.pravatar.cc/150?img=33" alt="Tu" />
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">Tu Usuario</p>
            <p className="text-sm text-gray-500">
              Compartiendo con la comunidad
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-6">
        {/* Text Content */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[200px] p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900 placeholder-gray-500 text-lg leading-relaxed"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {content.length}/500 caracteres
            </p>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Smile size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {showAdvanced && (
          <>
            {/* Images Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Imágenes</h3>
                <label className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer">
                  <Plus size={16} />
                  <span className="text-sm font-medium">Agregar fotos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Ubicación (opcional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="¿Dónde estás?"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash size={16} className="inline mr-2" />
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Agregar etiqueta..."
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Agregar
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span> Público</span>
            <span> Ahora</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Publicar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
