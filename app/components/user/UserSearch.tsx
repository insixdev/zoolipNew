import { useState } from "react";
import { useFetcher } from "react-router";
import { Search, Loader2, User } from "lucide-react";

type UserSearchResult = {
  id: number;
  username: string;
  email: string;
  nombre?: string;
  role: string;
};

type UserSearchProps = {
  onSelectUser?: (user: UserSearchResult) => void;
  placeholder?: string;
};

export default function UserSearch({
  onSelectUser,
  placeholder = "Buscar usuarios por nombre o email...",
}: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fetcher = useFetcher();

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Usar fetcher para buscar usuarios
    fetcher.load(`/api/user/search?query=${encodeURIComponent(searchQuery)}`);
  };

  // Actualizar resultados cuando el fetcher termine
  if (fetcher.data && fetcher.state === "idle" && isSearching) {
    setResults(fetcher.data.users || []);
    setIsSearching(false);
  }

  const handleSelectUser = (user: UserSearchResult) => {
    if (onSelectUser) {
      onSelectUser(user);
    }
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full">
      {/* Input de búsqueda */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
        />
        {isSearching && (
          <Loader2
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 animate-spin"
            size={20}
          />
        )}
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {results.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-semibold">
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {user.role}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {query && !isSearching && results.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
          No se encontraron usuarios
        </div>
      )}
    </div>
  );
}
