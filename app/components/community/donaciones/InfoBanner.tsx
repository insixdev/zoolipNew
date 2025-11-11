import React from "react";

type InfoBannerProps = {
  title: string;
  mainText: string;
  subText: string;
};

export const InfoBanner: React.FC<InfoBannerProps> = ({
  title,
  mainText,
  subText,
}) => {
  return (
    <section className="py-8 my-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-8 animate-slideInLeft">
          <h3 className="text-lg font-bold text-blue-900 mb-3">{title}</h3>
          <p className="text-blue-800 mb-2">{mainText}</p>
          <p className="text-sm text-blue-700">{subText}</p>
        </div>
      </div>
    </section>
  );
};
