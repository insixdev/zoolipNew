import React from "react";
import { FaShieldAlt } from "react-icons/fa";

type Props = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function VioletFormWrapper({
  title = "Información del Administrador",
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden ${className}`}
    >
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6">
        <div className="flex items-center gap-3 text-white">
          <FaShieldAlt className="text-2xl" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
  );
}
