import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Heart, MapPin, Calendar, Sparkles } from "lucide-react";
import { getAllMascotasService } from "~/features/adoption/adoptionService";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") || "";

  try {
    console.log("🐕 [ADOPT] Loading mascotas...");
    const mascotas = await getAllMascotasService(cookie);
    console.log("🐕 [ADOPT] Mascotas loaded:", mascotas.length);
    return { mascotas };
  } catch (error) {
    console.error("🐕 [ADOPT] Error loading mascotas:", error);
    return { mascotas: [] };
  }
}

export default function AdoptIndex() {
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
            No hay mascotas disponibles
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Por el momento no hay mascotas en adopción. Vuelve pronto para
            conocer a tu nuevo mejor amigo.
          </p>
          <Link
            to="/community"
            className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-8 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ir a la comunidad
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="text-white" size={20} />
            <span className="text-white font-medium">
              {mascotas.length} mascotas esperando un hogar
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Encuentra a tu nuevo
            <br />
            mejor amigo
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Cada mascota tiene una historia única y está lista para llenar tu
            vida de amor y alegría
          </p>
        </div>
      </div>

      {/* Mascotas Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mascotas.map((mascota, index) => (
            <Link
              key={mascota.id}
              to={`/adopt/mascota/${mascota.id}`}
              className="group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
                  <img
                    src={
                      mascota.imagen_url ||
                      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop"
                    }
                    alt={mascota.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Floating Heart */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <Heart
                      className="text-pink-500"
                      size={24}
                      fill="currentColor"
                    />
                  </div>

                  {/* Badge de disponibilidad */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Disponible
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name and Gender */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                      {mascota.nombre}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        mascota.sexo === "Macho"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {mascota.sexo || "N/A"}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} className="text-orange-500" />
                      <span className="text-sm">
                        {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} className="text-orange-500" />
                      <span className="text-sm">{mascota.raza}</span>
                    </div>
                  </div>

                  {/* Description Preview */}
                  {mascota.descripcion && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {mascota.descripcion}
                    </p>
                  )}

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold group-hover:from-orange-600 group-hover:to-pink-600 transition-all duration-300 shadow-md group-hover:shadow-lg transform group-hover:scale-105">
                    Conocer más
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para adoptar?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Adoptar es un acto de amor. Dale a una mascota la oportunidad de
            tener un hogar lleno de cariño.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/community"
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Únete a la comunidad
            </Link>
            <Link
              to="/adopt/solicitudes"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 border-2 border-white/50"
            >
              Ver solicitudes
            </Link>
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
      `}</style>
    </div>
  );
}
