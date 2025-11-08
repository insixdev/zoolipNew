import { useState, useEffect } from "react";
import { useNavigate, useFetcher, Link, useSearchParams } from "react-router";
import { Navbar } from "~/components/layout/navbar";
import GoogleButton from "~/components/ui/button/socialButton/GoogleButton";
import { useAuth } from "~/features/auth/useAuth";
import type { LoaderFunctionArgs } from "react-router";
import { redirectIfAuthenticated } from "~/lib/authGuard";

// Loader para redirigir usuarios autenticados al dashboard correspondiente
export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfAuthenticated(request);
  return null;
}

interface LoginErrors {
  username?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate();
  const fetcher = useFetcher<{ status: string; message: string }>();
  const { authError, setAuthError } = useAuth();
  const [searchParams] = useSearchParams();

  const isLoading = fetcher.state === "submitting";
  const redirectTo = searchParams.get("redirectTo") || "/profile";
  const isRegistered = searchParams.get("registered") === "true";

  // Clear field-specific errors when user starts typing
  const handleInputChange = (fieldName: keyof LoginErrors) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  // Handle auth error from context (from root loader)
  useEffect(() => {
    if (authError) {
      setErrors({
        general: authError.message || "Error de autenticación",
      });
      // Clear the auth error after showing it
      setAuthError(null);
    }
  }, [authError, setAuthError]);

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data) {
      console.log("Fetcher data received:", fetcher.data);
      if (fetcher.data.status === "success") {
        // Clear any existing errors on success
        setErrors({});
        console.log("Login exitoso, redirigiendo...");

        // Recargar la página para que el loader del root detecte el nuevo usuario
        // y redirija al dashboard correcto según el rol
        window.location.href = redirectTo.startsWith("/") ? redirectTo : "/";
      } else if (fetcher.data.status === "error") {
        setErrors({
          general: fetcher.data.message || "Usuario o contraseña incorrectos",
        });
      }
    }
  }, [fetcher.data, navigate, redirectTo]);

  // Client-side validation
  const validateForm = (formData: FormData): LoginErrors => {
    const errors: LoginErrors = {};
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username?.trim()) {
      errors.username = "Usuario requerido";
    }
    if (!password) {
      errors.password = "Contraseña requerida";
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submit triggered");

    const formData = new FormData(e.currentTarget);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      setErrors(validationErrors);
      console.log("Validation errors:", validationErrors);
      return;
    }

    // Clear errors and let React Router handle the submission
    setErrors({});
    console.log("Form submitting to action");
  };

  const bg = "bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50";
  return (
    <>
      <Navbar
        signButton={true}
        variant="light"
        hideMobile={true}
        hideNotifications={true}
      />
      <div
        className={`min-h-screen ${bg} flex items-start justify-center p-4 pt-24`}
      >
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8">
            <div className="text-center mb-8">
              <h1
                className="text-5xl font-bold mb-6"
                style={{
                  fontFamily: "Pacifico, cursive",
                  background: "linear-gradient(45deg, #f97316, #fb923c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Zoolip
              </h1>
              <p className="text-gray-600 text-sm">
                {searchParams.get("redirectTo")
                  ? "Inicia sesión para continuar"
                  : "Inicia sesión para conectar con la comunidad"}
              </p>
            </div>

            {isRegistered && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">
                ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.
              </div>
            )}

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {errors.general}
              </div>
            )}

            <fetcher.Form
              action="/api/auth/login"
              method="post"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  onChange={() => handleInputChange("username")}
                  className={`w-full px-4 py-3 text-black rounded-xl border ${
                    errors.username ? "border-red-300" : "border-gray-200"
                  } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="Ingresa tu usuario"
                  disabled={isLoading}
                  required
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contraseña
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-orange-600 hover:text-orange-700 transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  onChange={() => handleInputChange("password")}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3.5 rounded-xl cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-200 mt-6 shadow-lg shadow-orange-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </fetcher.Form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-sm text-gray-400">o continúa con</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <GoogleButton />

            <div className="mt-8 text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
              >
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
