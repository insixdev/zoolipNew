import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  HeroSection,
  DonationAmountCard,
  ImpactMetric,
  InfoBanner,
  CustomDonationInput,
  OtherWaysToHelpSection,
  PaymentMethodsSection,
  CTASection,
} from "~/components/community/donaciones";

type DonationAmount = {
  id: string;
  amount: number;
  label: string;
};

const donationAmounts: DonationAmount[] = [
  { id: "low", amount: 50, label: "$50 - Ayuda Básica" },
  { id: "medium", amount: 150, label: "$150 - Apoyo Significativo" },
  { id: "high", amount: 500, label: "$500 - Apoyo Premium" },
  { id: "premium", amount: 1000, label: "$1000 - Apoyo Máximo" },
];

const impactMetrics = [
  {
    label: "Animales Rescatados",
    value: "15,847",
    description: "En el último año con tu ayuda",
  },
  {
    label: "Vidas Salvadas",
    value: "12,450",
    description: "Animales que encontraron hogar",
  },
  {
    label: "Cirugías Realizadas",
    value: "3,200",
    description: "Tratamientos veterinarios completados",
  },
  {
    label: "Instituciones Aliadas",
    value: "127",
    description: "Refugios y veterinarias apoyadas",
  },
];

export default function DonacionesPage() {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<string>("medium");
  const [customAmount, setCustomAmount] = useState<number | null>(null);

  // Obtener monto actual (seleccionado o custom)
  const currentAmount =
    customAmount ||
    donationAmounts.find((a) => a.id === selectedAmount)?.amount ||
    150;

  const handleDonate = () => {
    // Redirigir a instituciones con el monto seleccionado
    navigate(`/community/donacionesInstitucion?monto=${currentAmount}`);
  };

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <HeroSection
          title="Apoya a Instituciones que Rescatan"
          subtitle="Con una donación directa, ayudas a refugios y veterinarias a salvar vidas."
          description="Elige la institución y el monto que deseas aportar"
        />

        {/* Impact Metrics */}
        <section className="py-16 bg-white rounded-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Impacto de Nuestras Instituciones
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactMetrics.map((metric, idx) => (
                <ImpactMetric
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  description={metric.description}
                  delay={idx * 100}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <InfoBanner
          title="Donaciones Directas a Instituciones"
          mainText="Realiza una donación única y directa. El 100% va a la institución que elijas."
          subText="Recibirás un comprobante de donación automáticamente para tus registros."
        />

        {/* Donation Amounts */}
        <section className="py-16 bg-white rounded-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Selecciona el Monto de Tu Donación
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Elige el monto que deseas donar. Luego selecciona a qué
              institución quieres apoyar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {donationAmounts.map((amount, idx) => (
                <div
                  key={amount.id}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <DonationAmountCard
                    id={amount.id}
                    amount={amount.amount}
                    label={amount.label}
                    isSelected={selectedAmount === amount.id}
                    onClick={() => setSelectedAmount(amount.id)}
                  />
                </div>
              ))}
            </div>

            <CustomDonationInput
              onChange={(value) => {
                setCustomAmount(value);
                setSelectedAmount(""); // Deseleccionar monto predefinido
              }}
            />
          </div>
        </section>

        {/* Other Ways to Help */}
        <OtherWaysToHelpSection />

        {/* Payment Methods */}
        <PaymentMethodsSection />

        {/* CTA Footer */}
        <CTASection
          title="¿Listo para hacer la diferencia?"
          description="Selecciona una institución y realiza tu donación ahora."
          buttonText="Continuar a Instituciones"
          onButtonClick={handleDonate}
        />

        <style>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fadeInDown {
            animation: fadeInDown 0.6s ease-out;
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
          }

          .animate-slideInLeft {
            animation: slideInLeft 0.6s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
