import { useState } from "react";
import {
  useLoaderData,
  useFetcher,
  Link,
  type LoaderFunctionArgs,
} from "react-router";
import { Heart, MapPin, Calendar, ArrowLeft, Send } from "lucide-react";
import { getMascotaByIdService } from "~/features/adoption/adoptionService";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const { id } = params;

  if (!id) {
    throw new Response("Mascota no encontrada", { status: 404 });
  }

  try {
    const mascota = await getMascotaByIdService(Number(id), cookie);
    return { mascota };
  } catch (error) {
    throw new Response("Error al cargar mascota", { status: 500 });
  }
}

export default function MascotaDetail() {
  const { mascota } = useLoaderData<typeof loader>();
  const { user } = useSmartAuth();
  const fetcher = useFetcher();
  const [showModal, setShowModal] = useState(false);
  const [razon, setRazon] = useState("");

  const handleSolicitar = () => {
    if (!user) {
      window.location.href = "/login?redirectTo=/adopt/mascota/" + mascota.id;
      return;
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_mascota", mascota.id.toString());
    formData.append("razon", razon);

    fetcher.submit(formData, {
      method: "post",
      action: "/api/adoption/solicitar",
    });
  };

  // Cerrar modal y limpiar cuando la solicitud sea exitosa
  if (fetcher.data?.status === "success" && showModal) {
    setShowModal(false);
    setRazon("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/adopt"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a adopciones
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative h-96 md:h-full">
              <img
                src={
                  mascota.imagen_url ||
                  "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=800&fit=crop"
                }
                alt={mascota.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="font-semibold text-gray-900">
                  {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {mascota.nombre}
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {mascota.raza}
                </span>
                <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                  {mascota.sexo}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {mascota.tamanio}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin
                    className="text-gray-400 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-medium text-gray-900">Ubicación</p>
                    <p className="text-gray-600">
                      {mascota.ubicacion || "No especificada"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar
                    className="text-gray-400 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-medium text-gray-900">Edad</p>
                    <p className="text-gray-600">
                      {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
                    </p>
                  </div>
                </div>
              </div>

              {mascota.descripcion && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Sobre {mascota.nombre}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {mascota.descripcion}
                  </p>
                </div>
              )}

              {/* Botón de solicitar */}
              {user ? (
                <button
                  onClick={handleSolicitar}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 px-8 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Heart size={20} />
                  Solicitar Adopción
                </button>
              ) : (
                <Link
                  to={`/login?redirectTo=/adopt/mascota/${mascota.id}`}
                  className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 px-8 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
                >
                  Inicia sesión para adoptar
                </Link>
              )}

              {fetcher.data?.status === "success" && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                  ¡Solicitud enviada! Te contactaremos pronto.
                </div>
              )}

              {fetcher.data?.status === "error" && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                  {fetcher.data.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de solicitud */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Solicitar adopción de {mascota.nombre}
            </h3>
            <fetcher.Form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Por qué quieres adoptar a {mascota.nombre}?
                </label>
                <textarea
                  value={razon}
                  onChange={(e) => setRazon(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Cuéntanos por qué serías un buen hogar para esta mascota..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={fetcher.state === "submitting"}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={fetcher.state === "submitting"}
                >
                  {fetcher.state === "submitting" ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar solicitud
                    </>
                  )}
                </button>
              </div>
            </fetcher.Form>
          </div>
        </div>
      )}
    </div>
  );
}
