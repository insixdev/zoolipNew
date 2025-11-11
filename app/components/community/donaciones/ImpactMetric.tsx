import React from "react";
import { Heart } from "lucide-react";

type ImpactMetricProps = {
  label: string;
  value: string;
  description: string;
  delay?: number;
};

export const ImpactMetric: React.FC<ImpactMetricProps> = ({
  label,
  value,
  description,
  delay = 0,
}) => {
  return (
    <div
      className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-4xl font-bold text-rose-600 mb-2">{value}</h3>
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};
