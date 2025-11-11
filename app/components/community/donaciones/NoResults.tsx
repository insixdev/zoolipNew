import React from "react";

type NoResultsProps = {
  searchTerm?: string;
};

export const NoResults: React.FC<NoResultsProps> = ({ searchTerm }) => {
  return (
    <div className="text-center py-16 animate-fadeInUp">
      <div className="text-6xl mb-4 opacity-50">○</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No encontramos instituciones
      </h3>
      <p className="text-gray-600">
        Intenta con otros filtros o términos de búsqueda
      </p>
    </div>
  );
};
