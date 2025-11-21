import { LoaderFunctionArgs, useLoaderData, Link } from "react-router";
import { getMascotaByIdService } from "~/features/adoption/adoptionService";
import type { MascotaDTO } from "~/features/adoption/types";
import { Heart, Share2, ArrowLeft, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { getUserFieldFromCookie, field } from "~/lib/authUtil";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.redirect("/auth/login");
  }

  const mascotaId = params.id;

  if (!mascotaId) {
    throw new Response("Mascota no encontrada", { status: 404 });
  }

  try {
    // Obtener datos de la mascota
    const mascota = await getMascotaByIdService(parseInt(mascotaId), cookie);

    if (!mascota || typeof mascota !== "object" || "message" in mascota) {
      throw new Response("Mascota no encontrada", { status: 404 });
    }

    // Obtener el ID del usuario actual desde la cookie
    const currentUserId = getUserFieldFromCookie(cookie, field.id);

    return { mascota, currentUserId };
  } catch (err) {
    throw new Response("Error al cargar mascota", { status: 500 });
  }
}

export default function MascotaProfile() {
  const { mascota } = useLoaderData<{
    mascota: MascotaDTO;
    currentUserId: number | null;
  }>();

  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header con botón de volver */}
        <div className="mb-6">
          <Link
            to="/community/profile"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a Mis Mascotas
          </Link>
        </div>

        {/* Perfil de la mascota */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Imagen principal */}
          <div className="relative h-96 overflow-hidden bg-gray-100">
            <img
              src={
                mascota.imagen_url ||
                `https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=600&fit=crop`
              }
              alt={mascota.nombre}
              className="w-full h-full object-cover"
            />
            
            {/* Botones flotantes */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-3 rounded-full transition-all shadow-lg ${
                  liked
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Heart size={24} fill={liked ? "currentColor" : "none"} />
              </button>
              <button className="p-3 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-all shadow-lg">
                <Share2 size={24} />
              </button>
            </div>

            {/* Estado de adopción - badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                  mascota.estadoAdopcion === "ADOPTADO"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {mascota.estadoAdopcion === "ADOPTADO"
                  ? "Mascota Adoptada"
                  : "Disponible"}
              </span>
            </div>
          </div>

          {/* Información de la mascota */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Detalles principales */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {mascota.nombre}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {mascota.especie} • {mascota.raza}
                </p>

                {/* Información básica */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 w-32">
                      Edad:
                    </span>
                    <span className="text-gray-600">
                      {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
                    </span>
                  </div>

                  {mascota.sexo && (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 w-32">
                        Sexo:
                      </span>
                      <span className="text-gray-600">{mascota.sexo}</span>
                    </div>
                  )}

                  {mascota.peso && (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 w-32">
                        Peso:
                      </span>
                      <span className="text-gray-600">{mascota.peso} kg</span>
                    </div>
                  )}

                  {mascota.color && (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 w-32">
                        Color:
                      </span>
                      <span className="text-gray-600">{mascota.color}</span>
                    </div>
                  )}

                  {mascota.estadoSalud && (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 w-32">
                        Salud:
                      </span>
                      <span className="text-gray-600">
                        {mascota.estadoSalud}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold">
                    Editar Perfil
                  </button>
                  <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all shadow-sm hover:shadow-md font-semibold">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Estadísticas y descripción */}
              <div>
                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <div className="text-sm text-gray-600 mb-1">Microchip</div>
                    <p className="text-lg font-semibold text-gray-900">
                      {mascota.microchip || "No registrado"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                    <div className="text-sm text-gray-600 mb-1">Vacunas</div>
                    <p className="text-lg font-semibold text-gray-900">
                      {mascota.vacunas ? "Al día" : "Pendiente"}
                    </p>
                  </div>
                </div>

                {/* Descripción */}
                {mascota.descripcion && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Sobre {mascota.nombre}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {mascota.descripcion}
                    </p>
                  </div>
                )}

                {/* Características especiales */}
                {mascota.caracteristicas && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Características
                    </h3>
                    <p className="text-sm text-gray-600">
                      {mascota.caracteristicas}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de requisitos de cuidado */}
            {mascota.requisitosAdopcion && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Requisitos especiales
                </h3>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-gray-600">{mascota.requisitosAdopcion}</p>
                </div>
              </div>
            )}

            {/* Historial médico */}
            {mascota.historialMedico && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Historial médico
                </h3>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-gray-600">{mascota.historialMedico}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer con información adicional */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {mascota.fechaAdopcion && (
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Fecha de adopción</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(mascota.fechaAdopcion).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}

              {mascota.id_institucion && (
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-pink-600" />
                  <div>
                    <p className="text-xs text-gray-600">De</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {mascota.institucion_nombre || "Refugio"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
