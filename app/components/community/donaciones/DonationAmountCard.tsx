import React from "react";
import { Check } from "lucide-react";

type DonationAmountCardProps = {
  id: string;
  amount: number;
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

export const DonationAmountCard: React.FC<DonationAmountCardProps> = ({
  id,
  amount,
  label,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 animate-fadeInUp ${
        isSelected
          ? "border-rose-500 bg-rose-50 shadow-lg"
          : "border-gray-200 bg-white hover:border-rose-300"
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 bg-rose-500 text-white rounded-full p-2">
          <Check className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{label}</h3>
      <p className="text-sm text-gray-600">
        Donación directa a la institución elegida
      </p>
    </div>
  );
};
