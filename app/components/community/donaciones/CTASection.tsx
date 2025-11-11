import React from "react";
import { useNavigate } from "react-router";

type CTASectionProps = {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
};

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <section className="py-16 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl my-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeInUp">
          {title}
        </h2>
        <p className="text-xl text-rose-100 mb-8 animate-fadeInUp">
          {description}
        </p>
        <button
          onClick={onButtonClick}
          className="bg-white text-rose-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};
