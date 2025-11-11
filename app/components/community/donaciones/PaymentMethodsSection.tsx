import React from "react";
import { Heart } from "lucide-react";
import { FaCreditCard, FaPaypal } from "react-icons/fa";

type PaymentMethodCardProps = {
  icon: React.ReactNode;
  label: string;
  delay?: number;
};

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  icon,
  label,
  delay = 0,
}) => {
  return (
    <div
      className="flex flex-col items-center animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-blue-100 rounded-full p-6 mb-4">{icon}</div>
      <p className="text-gray-700 font-semibold">{label}</p>
    </div>
  );
};

export const PaymentMethodsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white rounded-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Métodos de Pago Seguros
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-12 mb-8">
          <PaymentMethodCard
            icon={<FaCreditCard className="text-3xl text-blue-600" />}
            label="Tarjeta de Crédito"
            delay={0}
          />
          <PaymentMethodCard
            icon={<FaPaypal className="text-3xl text-blue-600" />}
            label="PayPal"
            delay={100}
          />
          <PaymentMethodCard
            icon={<Heart className="text-3xl text-rose-600" />}
            label="Transferencia Bancaria"
            delay={200}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-700 mb-2">
            <strong>100% seguro:</strong> Todas las transacciones están
            encriptadas
          </p>
          <p className="text-sm text-gray-700">
            Tu privacidad y seguridad son nuestra prioridad
          </p>
        </div>
      </div>
    </section>
  );
};
