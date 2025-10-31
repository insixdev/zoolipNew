import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { Navbar } from "~/components/layout/navbar";
import GoogleButton from "~/components/ui/button/socialButton/GoogleButton";
import Button from "~/components/ui/button/Button&Link/Button";
import { useAuth } from "~/features/auth/authContext";

interface LoginErrors {
  user?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const [formData, setFormData] = useState({ user: "", password: "" });
  // errores para poder mostrar al usuario notice de forma ui/uxwasz
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: LoginErrors = {};
    if (!formData.user.trim()) newErrors.user = "Usuario requerido";
    if (!formData.password) newErrors.password = "Contraseña requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const loginResult = await login({
        username: formData.user,
        password: formData.password,
      });

      if (loginResult) {
        // Login exitoso - el usuario está autenticado
        navigate("/profile");
      } else {
        // Login falló - credenciales incorrectas
        setErrors({ general: "Usuario o contraseña incorrectos" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Error al conectar con el servidor" });
    } finally {
      setIsLoading(false);
    }
  };
  const bg = "bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50";
  return (
    <>
      <Navbar signButton={false} variant="light" hideMobile={true} />
      <div
        className={`min-h-screen ${bg} flex items-start justify-center p-4 pt-24`}
      >
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8">
            {/* Instagram-style Zoolip Title */}
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
                Inicia sesión para conectar con la comunidad
              </p>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Usuario
                </label>
                <input
                  id="user"
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.user ? "border-red-300" : "border-gray-200"
                  } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="Ingresa tu usuario"
                  disabled={isLoading}
                />
                {errors.user && (
                  <p className="mt-1 text-sm text-red-500">{errors.user}</p>
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
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3.5 rounded-xl cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-200 mt-6 shadow-lg shadow-orange-300/50"
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
              </Button>
            </form>

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
