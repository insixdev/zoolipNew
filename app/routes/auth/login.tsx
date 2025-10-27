import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "~/components/layout/navbar";
import GoogleButton from "~/components/ui/button/socialButton/GoogleButton";
import Button from "~/components/ui/button/Button&Link/Button";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e target es el <input> q se dispara en el onChange
    const { name, value } = e.target;
    // actualizamos el formData dinamicamente
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email requerido";
    if (!formData.password) newErrors.password = "Contraseña requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Login:", formData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar signButton={false} variant="light" hideMobile={true} />
      <div className="min-h-screen bg-gradient-to-br from-white
        via-gray-200 to-amber-100 flex items-start justify-center p-4 pt-24">
        <div className="w-full max-w-sm">
          {/* Form compacto */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            {/* Header dentro del contenedor */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-1" style={{color: '#d67ca0'}}>Bienvenido</h2>
              <p className="text-sm text-gray-500">Inicia sesión en tu cuenta</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white text-gray-800 placeholder-gray-400"
                  placeholder="Email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white text-gray-800 placeholder-gray-400"
                  placeholder="Contraseña"
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-gray-500 hover:underline cursor-pointer transition-colors duration-200" style={{'--hover-color': '#d67ca0'} as React.CSSProperties}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                size="md"
                onClick={() => console.log("hello")}
                className="w-full text-white font-medium py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200"
                style={{backgroundColor: '#d67ca0'}}
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Iniciar sesión"}
              </Button>
            </form>

            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs text-gray-400">o</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <GoogleButton />

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="font-medium cursor-pointer hover:underline transition-colors duration-200" style={{color: '#d67ca0'}}>
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
