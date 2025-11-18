import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Heart, Calendar, Dog, MapPin } from "lucide-react";
import { getMisMascotasService } from "~/features/adoption/adoptionService";
import type { MascotaDTO } from "~/features/adoption/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") || "";

  try {
    const mascotas = await getMisMascotasService(cookie);

    return { mascotas };
  } catch (error) {
    console.error(" [MIS MASCOTAS] Error loading mascotas:", error);
    return { mascotas: [] };
  }
}

export default function MisMascotas() {
  const { mascotas } = useLoaderData<typeof loader>();

  // Empty state
  if (mascotas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="text-white" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Aún no tienes mascotas
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Cuando adoptes una mascota, aparecerá aquí. Explora las mascotas
            disponibles y encuentra a tu compañero ideal.
          </p>
          <a
            href="/adopt"
            className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-8 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ver mascotas disponibles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Minimalista con animaciones */}
      <div className="md:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="relative bg-white rounded-2xl border-2 border-orange-200 overflow-hidden">
            {/* Patrón de fondo animado */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYjkyM2MiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] animate-pulse"></div>
            </div>

            <div className="relative px-6 py-10 md:px-12 md:py-14">
              <div className="text-center">
                {/* Badge animado */}
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg mb-6 border-2 border-orange-200 animate-[slideDown_0.6s_ease-out]">
                  <Heart className="animate-pulse" size={18} />
                  <span className="text-sm font-semibold">
                    {mascotas.length}{" "}
                    {mascotas.length === 1
                      ? "mascota adoptada"
                      : "mascotas adoptadas"}
                  </span>
                </div>

                {/* Título con animación de entrada */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-[slideUp_0.8s_ease-out]">
                  Mis Mascotas
                </h1>

                {/* Descripción con animación */}
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-[fadeIn_1s_ease-out]">
                  Tus compañeros adoptados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mascotas Grid - Ajustado para sidebar */}
      <div className="md:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mascotas.map((mascota, index) => {
              const mascotaId = mascota.id || mascota.id_mascota;

              return (
                <div
                  key={mascotaId}
                  className="group"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50">
                      <img
                        src={
                          mascota.imagen_url ||
                          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop"
                        }
                        alt={mascota.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge de adoptado */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium border border-orange-200 shadow-sm">
                                                    Adoptado
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Name and Gender */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {mascota.nombre}
                        </h3>
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {mascota.sexo || "N/A"}
                        </span>
                      </div>

                      {/* Info Grid */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <Calendar
                            size={16}
                            className="text-orange-400 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs text-gray-500">Edad</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {mascota.edad}{" "}
                              {mascota.edad === 1 ? "año" : "años"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Dog
                            size={16}
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs text-gray-500">Raza</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {mascota.raza}
                            </p>
                          </div>
                        </div>
                        {mascota.nombreInstitucion && (
                          <div className="flex items-start gap-2">
                            <MapPin
                              size={16}
                              className="text-gray-400 mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <p className="text-xs text-gray-500">
                                Institución
                              </p>
                              <p className="text-sm text-gray-900 font-medium">
                                {mascota.nombreInstitucion}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description Preview */}
                      {mascota.descripcion && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {mascota.descripcion}
                        </p>
                      )}

                      {/* Info Badge */}
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-700 font-medium text-center">
                          Tu compañero adoptado
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
