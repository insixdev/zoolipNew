import React, { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";

type FeedTabsProps = {
  children: () => React.ReactNode;
  isLoading?: boolean;
};

export default function FeedTabs({
  children,
  isLoading = false,
}: FeedTabsProps) {
  return (
    <div className="w-full -mt-1">
      {/* Header */}
      <div className="sticky top-20 z-20 bg-rose-50/90 backdrop-blur-sm border-b border-rose-100">
        <div className="flex h-12">
          <div className="flex-1 h-full flex items-center justify-center font-medium text-sm text-rose-700 border-b-2 border-rose-600 font-semibold bg-rose-50/70">
            {isLoading ? "Cargando..." : "Para ti"}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-4">{children()}</div>
    </div>
  );
}
