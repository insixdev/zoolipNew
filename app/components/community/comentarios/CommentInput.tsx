import { useState } from "react";
import { useFetcher } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { Loader2 } from "lucide-react";

type CommentInputProps = {
  postId: string;
  onSubmit: (content: string) => void;
  placeholder?: string;
  userAvatar?: string;
};

export default function CommentInput({
  postId,
  onSubmit,
  placeholder = "Escribe un comentario...",
  userAvatar = "https://i.pravatar.cc/150?img=33",
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === "submitting";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const formData = new FormData();
      formData.append("id_publicacion", postId);
      formData.append("contenido", content);

      fetcher.submit(formData, {
        method: "post",
        action: "/api/comments/crear",
      });

      // Callback local para actualizar UI
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 p-4 border-t border-gray-100"
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={userAvatar} alt="Tu" />
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>

      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-gray-50 border-0 rounded-full focus:ring-2 focus:ring-rose-500 outline-none text-sm text-gray-900 placeholder-gray-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>...</span>
            </>
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </form>
  );
}
