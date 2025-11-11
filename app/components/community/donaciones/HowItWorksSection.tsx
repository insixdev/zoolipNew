import React from "react";

type HowItWorksProps = {
  steps: Array<{
    number: string;
    title: string;
    description: string;
  }>;
};

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ steps }) => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 animate-slideInLeft">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Cómo funciona tu donación
        </h3>
        <ul className="space-y-3 text-gray-700">
          {steps.map((step) => (
            <li key={step.number} className="flex gap-3">
              <span className="text-rose-600 font-bold text-lg flex-shrink-0">
                {step.number}
              </span>
              <span>
                <strong>{step.title}:</strong> {step.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
