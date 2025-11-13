import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Política de Cookies
          </h1>
          <p className="text-gray-600 mb-8">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>

          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>¿Qué son las Cookies?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Las cookies son pequeños archivos de texto que se almacenan en
                  tu dispositivo cuando visitas un sitio web. Se utilizan
                  ampliamente para hacer que los sitios web funcionen de manera
                  más eficiente y proporcionen información a los propietarios
                  del sitio.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Cookies que Utilizamos</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cookies Esenciales
                    </h4>
                    <p className="text-gray-700">
                      Estas cookies son necesarias para que el sitio web
                      funcione y no se pueden desactivar. Incluyen cookies de
                      autenticación y seguridad.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cookies de Rendimiento
                    </h4>
                    <p className="text-gray-700">
                      Nos ayudan a entender cómo los visitantes interactúan con
                      nuestro sitio web, recopilando información de forma
                      anónima.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cookies de Funcionalidad
                    </h4>
                    <p className="text-gray-700">
                      Permiten que el sitio web recuerde las elecciones que
                      haces (como tu idioma o región) y proporcionen
                      características mejoradas y más personales.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Cómo Controlar las Cookies</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Puedes controlar y/o eliminar las cookies como desees. Puedes
                  eliminar todas las cookies que ya están en tu dispositivo y
                  puedes configurar la mayoría de los navegadores para evitar
                  que se coloquen.
                </p>
                <p className="text-gray-700">
                  Sin embargo, si haces esto, es posible que tengas que ajustar
                  manualmente algunas preferencias cada vez que visites un sitio
                  y algunos servicios y funcionalidades pueden no funcionar.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Cookies de Terceros</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Algunos de nuestros socios pueden establecer cookies en tu
                  dispositivo cuando visitas Zoolip. Estos incluyen:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Google Analytics para análisis de tráfico</li>
                  <li>Servicios de redes sociales para compartir contenido</li>
                  <li>Proveedores de publicidad (si aplicable)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Más Información</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Si tienes preguntas sobre nuestra política de cookies, puedes
                  contactarnos en:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Email: cookies@zoolip.com</li>
                  <li>Teléfono: +34 900 123 456</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
