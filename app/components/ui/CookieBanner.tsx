import { useState, useEffect } from "react";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó las cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <section className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 pb-6 pt-6 shadow-lg border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 px-6 py-8 xs:px-10 md:px-8 lg:px-10">
          <div className="w-full md:w-7/12 lg:w-2/3">
            <div className="mb-6 md:mb-0">
              <h4 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white xs:text-2xl md:text-xl lg:text-2xl">
                Usamos cookies 🍪
              </h4>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Por favor, acepta estas cookies para continuar disfrutando de
                nuestro sitio!
              </p>
            </div>
          </div>

          <div className="w-full md:w-5/12 lg:w-1/3">
            <div className="flex items-center space-x-3 md:justify-end">
              <button
                onClick={handleAccept}
                className="inline-flex items-center justify-center rounded-md bg-rose-600 px-7 py-3 text-center text-base font-medium text-white hover:bg-rose-700 transition-colors"
              >
                Aceptar
              </button>
              <button
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-md bg-white px-7 py-3 text-center text-base font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookieBanner;
