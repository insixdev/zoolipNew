import React from "react";

type OtherWaysCardProps = {
  number: string;
  title: string;
  description: string;
  link: string;
  delay?: number;
};

const OtherWaysCard: React.FC<OtherWaysCardProps> = ({
  number,
  title,
  description,
  link,
  delay = 0,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-5xl font-bold text-rose-600 mb-4">{number}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a
        href={link}
        className="text-rose-600 font-semibold hover:text-rose-700 transition-colors"
      >
        Explorar más →
      </a>
    </div>
  );
};

export const OtherWaysToHelpSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 rounded-2xl my-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Otras Formas de Ayudar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <OtherWaysCard
            number="01"
            title="Voluntariado"
            description="Dedica tu tiempo y energía para ayudar a los animales."
            link="#voluntarios"
            delay={0}
          />
          <OtherWaysCard
            number="02"
            title="Apadrinar un Animal"
            description="Apadrina a un animal y recibe actualizaciones sobre su progreso."
            link="#apadrinar"
            delay={100}
          />
          <OtherWaysCard
            number="03"
            title="Alianzas Corporativas"
            description="¿Tu empresa quiere apoyar? Descubre nuestros programas especiales."
            link="#corporativo"
            delay={200}
          />
        </div>
      </div>
    </section>
  );
};
