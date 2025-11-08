import type { Refugio } from "~/components/ui/community";

interface EstadisticasRefugiosProps {
  refugios: Refugio[];
}

export function EstadisticasRefugios({ refugios }: EstadisticasRefugiosProps) {
  const totalRescatados = refugios.reduce(
    (sum, r) => sum + r.animalsRescued,
    0
  );
  const totalAdoptados = refugios.reduce(
    (sum, r) => sum + r.adoptionsCompleted,
    0
  );
  const totalEsperando = refugios.reduce((sum, r) => sum + r.currentAnimals, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl p-6 text-center">
        <div className="text-3xl font-bold mb-2">
          {totalRescatados.toLocaleString()}
        </div>
        <div className="text-rose-100">Animales Rescatados</div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 text-center">
        <div className="text-3xl font-bold mb-2">
          {totalAdoptados.toLocaleString()}
        </div>
        <div className="text-green-100">Adopciones Exitosas</div>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl p-6 text-center">
        <div className="text-3xl font-bold mb-2">{totalEsperando}</div>
        <div className="text-blue-100">Esperando Hogar</div>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-6 text-center">
        <div className="text-3xl font-bold mb-2">{refugios.length}</div>
        <div className="text-purple-100">Refugios Activos</div>
      </div>
    </div>
  );
}
