import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";

type CommentInputProps = {
  postId: string;
  onSubmit: (content: string) => void;
  placeholder?: string;
  userAvatar?: string;
  isSubmitting?: boolean;
};

export default function CommentInput({
  postId,
  onSubmit,
  placeholder = "Escribe un comentario...",
  userAvatar = "https://i.pravatar.cc/150?img=33",
  isSubmitting = false,
}: CommentInputProps) {
  const [content, setContent] = useState("");

  // Debug: verificar que onSubmit existe
  console.log("🟢 [INPUT] Component mounted/updated");
  console.log(
    "🟢 [INPUT] onSubmit callback exists?",
    typeof onSubmit === "function"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🟢 [INPUT] handleSubmit called");
    console.log("🟢 [INPUT] Content:", content);
    console.log("🟢 [INPUT] PostId:", postId);

    if (content.trim()) {
      console.log("🟢 [INPUT] Calling onSubmit callback");
      // Solo llamar al callback del padre que maneja todo
      onSubmit(content);
      setContent("");
      console.log("🟢 [INPUT] Content cleared");
    } else {
      console.log("🟢 [INPUT] Content is empty, not submitting");
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
          onClick={(e) => {
            console.log("🟢 [INPUT] Button clicked!");
            console.log(
              "🟢 [INPUT] Button disabled?",
              !content.trim() || isSubmitting
            );
            console.log("🟢 [INPUT] Content:", content);
          }}
          className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              ...
            </span>
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </form>
  );
}
