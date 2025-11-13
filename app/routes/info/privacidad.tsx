import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Política de Privacidad
          </h1>
          <p className="text-gray-600 mb-8">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>

          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                1. Información que Recopilamos
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Recopilamos información que nos proporcionas directamente,
                  como tu nombre, dirección de correo electrónico, número de
                  teléfono y otra información de contacto cuando te registras en
                  Zoolip.
                </p>
                <p className="text-gray-700">
                  También recopilamos información sobre tu uso de la plataforma,
                  incluyendo las páginas que visitas, las búsquedas que realizas
                  y las interacciones con otros usuarios.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. Cómo Usamos tu Información</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">Utilizamos tu información para:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Proporcionar y mejorar nuestros servicios</li>
                  <li>Facilitar el proceso de adopción</li>
                  <li>
                    Comunicarnos contigo sobre tu cuenta y actualizaciones
                  </li>
                  <li>Personalizar tu experiencia en la plataforma</li>
                  <li>Prevenir fraudes y garantizar la seguridad</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3. Compartir Información</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  No vendemos tu información personal a terceros. Podemos
                  compartir tu información con:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Refugios y protectoras cuando solicitas adoptar una mascota
                  </li>
                  <li>
                    Proveedores de servicios que nos ayudan a operar la
                    plataforma
                  </li>
                  <li>Autoridades legales cuando sea requerido por ley</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                4. Cookies y Tecnologías Similares
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Utilizamos cookies y tecnologías similares para mejorar tu
                  experiencia, analizar el uso de la plataforma y personalizar
                  el contenido.
                </p>
                <p className="text-gray-700">
                  Puedes controlar el uso de cookies a través de la
                  configuración de tu navegador. Ten en cuenta que deshabilitar
                  las cookies puede afectar la funcionalidad de la plataforma.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>5. Seguridad de los Datos</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Implementamos medidas de seguridad técnicas y organizativas
                  para proteger tu información personal contra acceso no
                  autorizado, pérdida o alteración.
                </p>
                <p className="text-gray-700">
                  Sin embargo, ningún método de transmisión por Internet o
                  almacenamiento electrónico es 100% seguro. No podemos
                  garantizar la seguridad absoluta de tu información.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>6. Tus Derechos</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">Tienes derecho a:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir información inexacta</li>
                  <li>Solicitar la eliminación de tu información</li>
                  <li>Oponerte al procesamiento de tu información</li>
                  <li>Solicitar la portabilidad de tus datos</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>7. Contacto</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Si tienes preguntas sobre esta política de privacidad o deseas
                  ejercer tus derechos, contáctanos en:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Email: privacidad@zoolip.com</li>
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
