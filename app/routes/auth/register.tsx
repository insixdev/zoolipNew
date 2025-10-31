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

  const bg = 'bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50';
  
  return (
    <>
      <Navbar signButton={false} variant="light" hideMobile={true} />
      <div className={`min-h-screen ${bg} flex items-start justify-center p-4 pt-24`}>
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6">
            {/* Instagram-style Zoolip Title */}
            <div className="text-center mb-6">
              <h1 className="text-5xl font-bold mb-4" style={{ 
                fontFamily: 'Pacifico, cursive',
                background: 'linear-gradient(45deg, #f97316, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Zoolip
              </h1>
              <p className="text-gray-600 text-sm">Únete a la comunidad</p>
            </div>

            {generalError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="Tu nombre completo"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.password ? 'border-red-300' : 'border-gray-200'
                  } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                  } focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white text-gray-800 placeholder-gray-400`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 rounded-xl cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-200 mt-4 shadow-lg shadow-orange-300/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </span>
                ) : 'Crear cuenta'}
              </Button>
            </form>

            <div className="my-5 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-sm text-gray-400">o continúa con</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <GoogleButton />

            <div className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link 
                to="/login" 
                className="font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
              >
                Inicia sesión
              </Link>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Al crear una cuenta, aceptas nuestros{" "}
                <Link to="/terms" className="underline hover:text-orange-700 transition-colors duration-200 text-orange-600">
                  Términos
                </Link>{" "}
                y{" "}
                <Link to="/privacy" className="underline hover:text-orange-700 transition-colors duration-200 text-orange-600">
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
