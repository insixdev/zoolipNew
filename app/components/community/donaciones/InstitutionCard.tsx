import React from "react";
import { ChevronRight, Activity, MapPin, Phone, Mail } from "lucide-react";

type Institucion = {
  id: number;
  nombre: string;
  tipo: "refugio" | "veterinaria";
  ubicacion: string;
  telefono: string;
  email: string;
  descripcion: string;
  animalesRescatados: number;
  especialidad: string;
  color: string;
};

type InstitutionCardProps = {
  institucion: Institucion;
  onSelect: (institucion: Institucion) => void;
  delay?: number;
};

export const InstitutionCard: React.FC<InstitutionCardProps> = ({
  institucion,
  onSelect,
  delay = 0,
}) => {
  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-rose-200 transform hover:scale-102 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header with Gradient */}
      <div
        className={`bg-gradient-to-r ${institucion.color} p-6 text-white relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full bg-white bg-opacity-20 text-white backdrop-blur-sm`}
              >
                {institucion.tipo === "refugio" ? "REFUGIO" : "VETERINARIA"}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {institucion.nombre}
          </h3>
          <p className="text-white text-sm opacity-90">
            {institucion.especialidad}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all">
          {institucion.descripcion}
        </p>

        {/* Stats */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 flex items-center gap-3">
          <div className="bg-rose-100 rounded-full p-3">
            <Activity className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">IMPACTO</p>
            <p className="text-lg font-bold text-gray-900">
              {institucion.animalesRescatados.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">animales atendidos</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 text-sm text-gray-700 hover:text-rose-600 transition-colors">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{institucion.ubicacion}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 hover:text-rose-600 transition-colors">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a href={`tel:${institucion.telefono}`} className="hover:underline">
              {institucion.telefono}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 hover:text-rose-600 transition-colors">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a href={`mailto:${institucion.email}`} className="hover:underline">
              {institucion.email}
            </a>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelect(institucion)}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn mt-4"
        >
          <span>Donar a esta Institución</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
