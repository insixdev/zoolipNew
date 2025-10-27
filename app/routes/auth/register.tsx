import { useState } from "react";
import { Link } from "react-router";
import GoogleButton from "~/components/ui/button/socialButton/GoogleButton";
import Button from "~/components/ui/button/Button&Link/Button";
import Navbar from "~/components/layout/navbar/Navbar";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
};

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Here you would make your API call
      console.log("Registering user:", formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar signButton={false} variant="light" hideMobile={true} />
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-200 to-amber-100 flex items-start justify-center p-4 pt-24">
        <div className="w-full max-w-xs">
          {/* Form compacto */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-5">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Únete a nuestra comunidad
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Crea tu cuenta y comienza a salvar vidas
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-200/50 outline-none transition-all duration-200 bg-white/95"
                placeholder="Tu nombre completo"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-200/50 outline-none transition-all duration-200 bg-white/95"
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-200/50 outline-none transition-all duration-200 bg-white/95"
                placeholder="Mínimo 8 caracteres"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-amber-300 focus:ring-1 focus:ring-amber-200/50 outline-none transition-all duration-200 bg-white/95"
                placeholder="Repite tu contraseña"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="md"
              variant="especial"
              className="w-full text-white font-medium py-2 rounded-lg transition-all duration-200 text-sm"
              style={{backgroundColor: '#d67ca0'}}
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            </form>

            {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400">o continúa con</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Button */}
          <GoogleButton />

          {/* Login Link */}
          <div className="mt-4 text-center text-xs">
            <p className="text-gray-500">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-rose-500 hover:text-rose-600">
                Inicia sesión
              </Link>
            </p>
          </div>

            {/* Terms */}
            <div className="mt-4 text-center">
              <p className="text-[10px] text-gray-400">
                Al crear una cuenta, aceptas nuestros{" "}
                <Link to="/terms" className="underline hover:text-gray-600">
                  Términos
                </Link>{" "}
                y{" "}
                <Link to="/privacy" className="underline hover:text-gray-600">
                  Privacidad
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}