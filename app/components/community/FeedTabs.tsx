import React, { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";

type FeedTabsProps = {
  onTabChange?: (tab: "forYou" | "following") => void;
  initialTab?: "forYou" | "following";
  children: (activeTab: "forYou" | "following") => React.ReactNode;
  isLoading?: boolean;
};

export default function FeedTabs({
  onTabChange,
  initialTab = "forYou",
  children,
  isLoading = false,
}: FeedTabsProps) {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">(
    initialTab
  );

  const handleTabChange = (tab: "forYou" | "following") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="w-full -mt-1">
      {/* Pestañas de navegación */}
      <div className="sticky top-20 z-20 bg-rose-50/90 backdrop-blur-sm border-b border-rose-100">
        <div className="flex h-12">
          <button
            type="button"
            onClick={() => handleTabChange("forYou")}
            className={`flex-1 h-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${
              activeTab === "forYou"
                ? isLoading
                  ? "text-rose-800 border-b-2 border-rose-700 font-semibold bg-rose-100/90"
                  : "text-rose-700 border-b-2 border-rose-600 font-semibold bg-rose-50/70"
                : "text-rose-600/90 hover:bg-rose-100/60 hover:text-rose-800"
            }`}
          >
            {isLoading && activeTab === "forYou" ? "Cargando..." : "Para ti"}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("following")}
            className={`flex-1 h-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${
              activeTab === "following"
                ? isLoading
                  ? "text-rose-800 border-b-2 border-rose-700 font-semibold bg-rose-100/90"
                  : "text-rose-700 border-b-2 border-rose-600 font-semibold bg-rose-50/70"
                : "text-rose-600/90 hover:bg-rose-100/60 hover:text-rose-800"
            }`}
          >
            {isLoading && activeTab === "following"
              ? "Cargando..."
              : "Siguiendo"}
          </button>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="space-y-4">{children(activeTab)}</div>
    </div>
  );
}

// Componente para el estado vacío de "Siguiendo"
export function EmptyFollowingState() {
  return (
    <div className="py-12 text-center">
      <h3 className="text-lg font-medium text-gray-700">
        Publicaciones de las cuentas que sigues
      </h3>
      <p className="text-gray-500 mt-2">
        Cuando sigas a personas, sus publicaciones aparecerán aquí.
      </p>
      <button className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-full text-sm font-medium hover:bg-rose-700 transition-colors">
        Descubrir a quién seguir
      </button>
    </div>
  );
}
