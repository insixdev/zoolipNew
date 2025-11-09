import { useState } from "react";
import { Link, redirect, useLoaderData, useFetcher } from "react-router";
import Button from "~/components/ui/button/Button&Link/Button";
import Navbar from "~/components/layout/navbar/Navbar";
import type { ActionFunctionArgs } from "react-router";
import { redirectIfAuthenticated } from "~/lib/authGuard";
import {
  loginService,
  registerService,
} from "~/features/auth/authServiceCurrent";
import {
  cleanExpiratedInvites,
  validateToken,
  valideResponse,
} from "~/features/admin/adminRegisterInvitation";
import {
  addInstitutionService,
  getInstitutionByIdService,
} from "~/features/entities/institucion/institutionService";
import {
  InstitutionCreateRequest,
  InstitutionType,
  UserId,
} from "~/features/entities/institucion/types";
import { createVeterinarianService } from "~/features/entities/veterinarios/veterinarianService";
import {
  InstitutionId,
  VeterinarianCreateRequest,
} from "~/features/entities/veterinarios/types";
import { decodeClaims, getUserInfoFromToken } from "~/lib/authUtil";
import { getTokenFromCookie } from "~/server/cookies";
import { registrarAdminProcess } from "~/features/entities/entitiesProcess";
import { UserAppRegister } from "~/features/entities/User";

// Loader para redirigir usuarios autenticados
export async function loader({ params, request }) {
  cleanExpiratedInvites(); // clean a los invitados expirados
  await redirectIfAuthenticated(request, "/admin/dashboard");
  const { token } = params;
  console.log("token", token);
  if (!token) {
    throw new Response("No se pudo acceder a la invitacion", { status: 404 });
  }
  const valid = validateToken(token);

  if (!(valid instanceof valideResponse)) {
    throw new Response(valid.message, { status: valid.status });
  }
  console.log("ROLE:", valid.role);
  return Response.json(
    { email: valid.email, role: valid.role },
    { status: 200 }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userData: UserAppRegister = {
    username: formData.get("name") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
  };

  // validar el role
  if (
    userData.role === "PROTECTORA" ||
    userData.role === "VETERINARIO" ||
    userData.role === "REFUGIO"
  ) {
    return Response.json(
      { error: "El rol no es valido, contacta al administrador" },
      { status: 400 }
    );
  }

  console.log("Admin Registration Data:", userData);

  try {
    const cookie = await registrarAdminProcess(userData);
    // debugear si esta bien
    if (!(typeof cookie === "string")) {
      return Response.json(
        { error: cookie.error, status: cookie.status },
        { status: 400 }
      );
    }
    

    const token = getTokenFromCookie(cookie);
    if (!token) {
      return Response.json(
        { error: "Error al registrar la institucion intentalo de nuevo" },
        { status: 400 }
      );
    }
    const payload = decodeClaims(token);
    if (!payload.valid) {
      return Response.json(
        {
          error:
            "Error al registrar la institucion intentalo de nuevo, no valido",
        },
        { status: 400 }
      );
    }
    const infoUserData = getUserInfoFromToken(payload.payload);

    if (userData.role !== "ADMIN") {
      if (!infoUserData) {
        return Response.json(
          { error: "En la autenticacion no se encontro el usuario" },
          { status: 400 }
        );
      }
      const userid: UserId = {
        id: Number(infoUserData.id),
      };
      const institucionData: InstitutionCreateRequest = {
        nombre: formData.get("nombreInstitucion") as string,
        tipo: formData.get("tipoInstitucion") as InstitutionType,
        email: formData.get("emailInstitucion") as string,
        descripcion: formData.get("descripcion") as string,
        horario_inicio: formData.get("horario_inicio") as string,
        horario_fin: formData.get("horario_fin") as string,
        id_usuario: userid,
      };

      const res = await addInstitutionService(institucionData, cookie);

      if (!res) {
        return Response.json(
          { error: "Error al registrar la institucion intentalo de nuevo" },
          { status: 400 }
        );
      }
      if (userData.role === "VETERINARIO") {
        // WARNING ID de la institucion no hay conmo obtenerlo
        // se usara por ahora la de usuario (admin)

        const vetData = await getInstitutionByIdService(userid.id, cookie);
        if (!vetData) {
          return Response.json(
            { error: "Error al registrar el veterinario intentalo de nuevo" },
            { status: 400 }
          );
        }

        const intitucionId: InstitutionId = {
          id_institucion: userid.id,
        };
        const veterinarianData: VeterinarianCreateRequest = {
          nombre: vetData.nombre as string,
          id_institucion: intitucionId,
        };
        await createVeterinarianService(veterinarianData, cookie);
      }
    }
    return redirect("/admin/login?registered=true");
  } catch (error) {
    console.error("Admin registration error:", error);
    return {
      success: false,
      error: "Error al registrar el administrador: " + error,
    };
  }
}

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  nombreInstitucion?: string;
  tipoInstitucion?: string;
  emailInstitucion?: string;
  descripcion?: string;
  horario_inicio?: string;
  horario_fin?: string;
  [key: string]: string | undefined;
};

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nombreInstitucion?: string;
  tipoInstitucion?: string;
  emailInstitucion?: string;
  descripcion?: string;
  horario_inicio?: string;
  horario_fin?: string;
};
/**
* Formulario de registro de administrador
* */
export default function AdminRegister() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nombreInstitucion: "",
    tipoInstitucion: "",
    emailInstitucion: "",
    descripcion: "",
    horario_inicio: "",
    horario_fin: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { email, role } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const isLoading = fetcher.state === "submitting";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    setErrors({});

    const newErrors: FormErrors = {};

    // Validaciones básicas
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    if (formData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validaciones para instituciones (REFUGIO o PROTECTORA)
    if (role === "REFUGIO" || role === "PROTECTORA" || role === "VETERINARIA") {
      if (!formData.nombreInstitucion?.trim()) {
        newErrors.nombreInstitucion =
          "El nombre de la institución es requerido";
      }
      if (!formData.tipoInstitucion) {
        newErrors.tipoInstitucion = "Debes seleccionar un tipo de institución";
      }
      if (!formData.emailInstitucion?.trim()) {
        newErrors.emailInstitucion = "El email de la institución es requerido";
      }
      if (!formData.descripcion?.trim()) {
        newErrors.descripcion = "La descripción es requerida";
      }
      if (!formData.horario_inicio) {
        newErrors.horario_inicio = "La hora de inicio es requerida";
      }
      if (!formData.horario_fin) {
        newErrors.horario_fin = "La hora de fin es requerida";
      }
      // Validar que la hora de fin sea después de la hora de inicio
      if (formData.horario_inicio && formData.horario_fin) {
        if (formData.horario_inicio >= formData.horario_fin) {
          newErrors.horario_fin =
            "La hora de fin debe ser después de la hora de inicio";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      e.preventDefault();
      setErrors(newErrors);
      return;
    }
  };

  const bg = "bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50";

  return (
    <>
      <Navbar
        signButton={false}
        variant="light"
        hideMobile={true}
        hideNotifications={true}
      />
      <div
        className={`min-h-screen ${bg} flex items-start justify-center p-4 pt-24`}
      >
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100 p-6">
            <div className="text-center mb-6">
              <h1
                className="text-5xl font-bold mb-4"
                style={{
                  fontFamily: "Pacifico, cursive",
                  background:
                    "linear-gradient(45deg, #db2777, #ec4899, #e11d8b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Zoolip Admin
              </h1>
              <p className="text-gray-600 text-sm">
                Bienvenido has sido invitado: {email}
              </p>
              <p className="text-gray-400 text-sm">
                Registro de administrador, rol: {role}
              </p>
            </div>

            {fetcher.data && !fetcher.data.success && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {fetcher.data.error}
              </div>
            )}

            <fetcher.Form
              method="post"
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <input type="hidden" name="role" value={role} />
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.name ? "border-red-300" : "border-gray-200"
                  } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="Tu nombre completo"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="admin@ejemplo.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-200"
                  } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              {(role === "REFUGIO" || role === "PROTECTORA") && (
                <>
                  <div className="mt-4 p-4 bg-fuchsia-50/50 border border-fuchsia-200 rounded-xl space-y-3">
                    <h3 className="text-sm font-semibold text-fuchsia-900 mb-2">
                      Información de la Institución
                    </h3>

                    <div className="space-y-1">
                      <label
                        htmlFor="nombreInstitucion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nombre de la institución{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nombreInstitucion"
                        name="nombreInstitucion"
                        value={formData.nombreInstitucion || ""}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.nombreInstitucion
                            ? "border-red-300"
                            : "border-gray-200"
                        } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                        placeholder="Ej: Refugio Patitas Felices"
                        disabled={isLoading}
                      />
                      {errors.nombreInstitucion && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.nombreInstitucion}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="tipoInstitucion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tipo de institución{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="tipoInstitucion"
                        name="tipoInstitucion"
                        value={formData.tipoInstitucion || ""}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.tipoInstitucion
                            ? "border-red-300"
                            : "border-gray-200"
                        } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800`}
                        disabled={isLoading}
                      >
                        <option value="">Selecciona un tipo</option>
                        <option value="REFUGIO">Refugio</option>
                        <option value="PROTECTORA">Protectora</option>
                      </select>
                      {errors.tipoInstitucion && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.tipoInstitucion}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="emailInstitucion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email de la institución{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="emailInstitucion"
                        name="emailInstitucion"
                        value={formData.emailInstitucion || ""}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.emailInstitucion
                            ? "border-red-300"
                            : "border-gray-200"
                        } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                        placeholder="contacto@institucion.com"
                        disabled={isLoading}
                      />
                      {errors.emailInstitucion && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.emailInstitucion}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="descripcion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Descripción <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion || ""}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.descripcion
                            ? "border-red-300"
                            : "border-gray-200"
                        } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                        placeholder="Descripción de la institución"
                        rows={3}
                        disabled={isLoading}
                      />
                      {errors.descripcion && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label
                          htmlFor="horario_inicio"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Hora de inicio <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          id="horario_inicio"
                          name="horario_inicio"
                          value={formData.horario_inicio || ""}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.horario_inicio
                              ? "border-red-300"
                              : "border-gray-200"
                          } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800`}
                          disabled={isLoading}
                        />
                        {errors.horario_inicio && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.horario_inicio}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="horario_fin"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Hora de fin <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          id="horario_fin"
                          name="horario_fin"
                          value={formData.horario_fin || ""}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.horario_fin
                              ? "border-red-300"
                              : "border-gray-200"
                          } focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition-all bg-white text-gray-800`}
                          disabled={isLoading}
                        />
                        {errors.horario_fin && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.horario_fin}
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                </>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-medium py-3 rounded-xl cursor-pointer hover:from-fuchsia-700 hover:to-pink-700 transition-all duration-200 mt-4 shadow-lg shadow-fuchsia-200/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creando cuenta de administrador...
                  </span>
                ) : (
                  "Crear cuenta de administrador"
                )}
              </Button>
            </fetcher.Form>

            <div className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/admin/login"
                className="font-medium text-fuchsia-600 hover:text-fuchsia-700 hover:underline transition-colors duration-200"
              >
                Inicia sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
