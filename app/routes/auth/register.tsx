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
  const [generalError, setGeneralError] = useState<string | null>(null);

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
    setGeneralError(null);
    setErrors({});
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
      // Simulate API call with potential error
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate API error for testing
          // reject(new Error('Error de red')); // Uncomment to test error state
          resolve(true);
        }, 1000);
      });
      
      // Redirect to login after successful registration
      // navigate('/login'); // Uncomment when ready
    } catch (error) {
      console.error("Registration error:", error);
      setGeneralError("Error al registrar el usuario. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar signButton={false} variant="light" hideMobile={true} />
      <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-200 via-indigo-200 to-orange-100 flex items-start justify-center p-4 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#d67ca0' }}>Crea tu cuenta</h2>
              <p className="text-gray-600">Únete a nuestra comunidad</p>
            </div>

            {/* Error Message */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {generalError}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                placeholder="Tu nombre completo"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-300' : 'border-gray-200'
                } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                placeholder="Ingresa tu email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.password ? 'border-red-300' : 'border-gray-200'
                } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                placeholder="Crea una contraseña"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                placeholder="Confirma tu contraseña"
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
              className="w-full text-white font-medium py-3.5 rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 mt-2"
              style={{ 
                backgroundColor: '#d67ca0',
                boxShadow: '0 4px 14px rgba(214, 124, 160, 0.3)'
              }}
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            </form>

            {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">o continúa con</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Button */}
          <GoogleButton />

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link 
              to="/login" 
              className="font-medium hover:underline transition-colors duration-200" 
              style={{ color: '#d67ca0' }}
            >
              Inicia sesión
            </Link>
          </div>

          {/* Terms */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Al crear una cuenta, aceptas nuestros{" "}
              <Link to="/terms" className="underline hover:text-pink-600 transition-colors duration-200" style={{ color: '#d67ca0' }}>
                Términos
              </Link>{" "}
              y{" "}
              <Link to="/privacy" className="underline hover:text-pink-600 transition-colors duration-200" style={{ color: '#d67ca0' }}>
                Política de privacidad
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}