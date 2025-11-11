import React from "react";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
}) => {
  return (
    <section className="relative bg-gradient-to-r from-rose-500 to-pink-500 text-white py-16 md:py-24 overflow-hidden rounded-2xl mb-8">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-rose-100 mb-2 animate-fadeInUp">
            {subtitle}
          </p>
          <p className="text-lg text-rose-100 animate-fadeInUp">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};
