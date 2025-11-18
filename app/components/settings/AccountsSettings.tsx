import { Users, Mail, Shield, Calendar } from "lucide-react";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { useFetcher } from "react-router";
import { useEffect } from "react";

export default function AccountsSettings() {
  const { user } = useSmartAuth();
  const fetcher = useFetcher();

  // Cargar cuentas asociadas al email cuando el componente se monta
  useEffect(() => {
    if (user?.email) {
      fetcher.load(
        `/api/user/accounts?email=${encodeURIComponent(user.email)}`
      );
    }
  }, [user?.email]);

  const accounts = fetcher.data?.accounts || [];
  const isLoading = fetcher.state === "loading";

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Cuentas Asociadas
            </h3>
            <p className="text-sm text-gray-500">
              Todas las cuentas vinculadas a tu email
            </p>
          </div>
        </div>

        {/* Email actual */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Email principal
            </span>
          </div>
          <p className="text-gray-900 font-semibold">{user?.email}</p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Cargando cuentas...</p>
          </div>
        )}

        {/* Lista de cuentas */}
        {!isLoading && accounts.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {accounts.length}{" "}
              {accounts.length === 1
                ? "cuenta encontrada"
                : "cuentas encontradas"}
            </h4>
            {accounts.map((account: any, index: number) => (
              <div
                key={account.id || index}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-400 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-gray-900">
                        {account.username || account.nombre || "Usuario"}
                      </h5>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          account.rol === "ROLE_ADOPTANTE"
                            ? "bg-green-100 text-green-700"
                            : account.rol === "ROLE_ADMINISTRADOR"
                              ? "bg-purple-100 text-purple-700"
                              : account.rol === "ROLE_VETERINARIA"
                                ? "bg-blue-100 text-blue-700"
                                : account.rol === "ROLE_REFUGIO"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {account.rol?.replace("ROLE_", "")}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span>{account.email}</span>
                      </div>
                      {account.fecha_registro && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>
                            Registrado:{" "}
                            {new Date(
                              account.fecha_registro
                            ).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                      )}
                      {account.id_institucion && (
                        <div className="flex items-center gap-2">
                          <Shield size={14} className="text-gray-400" />
                          <span>Institución ID: {account.id_institucion}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {account.id === user?.id && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                      Actual
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && accounts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron cuentas
            </h4>
            <p className="text-gray-600">
              No hay otras cuentas asociadas a este email
            </p>
          </div>
        )}

        {/* Info adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Nota:</strong> Todas las cuentas con el mismo email
            pueden acceder a la plataforma con diferentes roles y permisos.
          </p>
        </div>
      </div>
    </div>
  );
}
