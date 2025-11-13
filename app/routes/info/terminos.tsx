import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";

export default function Terminos() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600 mb-8">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>

          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>1. Aceptación de los Términos</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Al acceder y utilizar Zoolip, aceptas estar sujeto a estos
                  términos y condiciones. Si no estás de acuerdo con alguna
                  parte de estos términos, no debes utilizar nuestro servicio.
                </p>
                <p className="text-gray-700">
                  Nos reservamos el derecho de modificar estos términos en
                  cualquier momento. Es tu responsabilidad revisar
                  periódicamente estos términos para estar al tanto de cualquier
                  cambio.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. Uso del Servicio</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Zoolip es una plataforma diseñada para facilitar la adopción
                  de mascotas y conectar a adoptantes con refugios y protectoras
                  de animales.
                </p>
                <p className="text-gray-700">
                  Te comprometes a utilizar el servicio de manera responsable y
                  ética, proporcionando información veraz y actualizada sobre ti
                  y las mascotas que publiques.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3. Cuentas de Usuario</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Para utilizar ciertas funciones de Zoolip, debes crear una
                  cuenta. Eres responsable de mantener la confidencialidad de tu
                  cuenta y contraseña.
                </p>
                <p className="text-gray-700">
                  Debes notificarnos inmediatamente sobre cualquier uso no
                  autorizado de tu cuenta. No seremos responsables de ninguna
                  pérdida que puedas sufrir como resultado del uso no autorizado
                  de tu cuenta.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>4. Contenido del Usuario</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Eres responsable del contenido que publicas en Zoolip,
                  incluyendo fotos, descripciones y comentarios. No debes
                  publicar contenido que sea ilegal, ofensivo o que viole los
                  derechos de terceros.
                </p>
                <p className="text-gray-700">
                  Nos reservamos el derecho de eliminar cualquier contenido que
                  consideremos inapropiado sin previo aviso.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>5. Proceso de Adopción</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Zoolip facilita el contacto entre adoptantes y refugios, pero
                  no somos parte del proceso de adopción. Cada refugio o
                  protectora establece sus propios requisitos y procedimientos.
                </p>
                <p className="text-gray-700">
                  No garantizamos que una solicitud de adopción sea aprobada. La
                  decisión final siempre recae en el refugio o protectora.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>
                6. Limitación de Responsabilidad
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Zoolip se proporciona "tal cual" sin garantías de ningún tipo.
                  No seremos responsables de ningún daño directo, indirecto,
                  incidental o consecuente que resulte del uso o la
                  imposibilidad de usar nuestro servicio.
                </p>
                <p className="text-gray-700">
                  No nos hacemos responsables de la veracidad de la información
                  proporcionada por los usuarios o de las interacciones entre
                  adoptantes y refugios.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>7. Contacto</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Si tienes preguntas sobre estos términos y condiciones, puedes
                  contactarnos a través de:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Email: legal@zoolip.com</li>
                  <li>Teléfono: +34 900 123 456</li>
                  <li>Dirección: Calle Principal 123, Madrid, España</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
