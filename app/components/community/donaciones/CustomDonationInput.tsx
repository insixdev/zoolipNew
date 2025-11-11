import React from "react";

type CustomDonationInputProps = {
  placeholder?: string;
  onChange?: (value: number) => void;
};

export const CustomDonationInput: React.FC<CustomDonationInputProps> = ({
  placeholder = "Ingresa monto",
  onChange,
}) => {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-6">O ingresa un monto personalizado:</p>
      <div className="flex justify-center gap-3">
        <div className="relative">
          <span className="absolute left-4 top-3 text-gray-600 font-semibold">
            $
          </span>
          <input
            type="number"
            placeholder={placeholder}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className="pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-40"
            min="10"
          />
        </div>
      </div>
    </div>
  );
};
