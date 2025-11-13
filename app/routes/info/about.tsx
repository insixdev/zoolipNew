import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sobre Zoolip
          </h1>
          <p className="text-gray-600 mb-8">
            Conectando corazones con patitas desde 2024
          </p>

          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>Nuestra Misión</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  En Zoolip, nuestra misión es facilitar la adopción responsable
                  de mascotas, conectando a personas que buscan un compañero
                  peludo con refugios y protectoras que cuidan de animales
                  necesitados.
                </p>
                <p className="text-gray-700">
                  Creemos que cada mascota merece un hogar amoroso y cada
                  persona merece la alegría que trae una mascota a su vida.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Nuestra Historia</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  Zoolip nació de la pasión por los animales y la tecnología.
                  Fundada en 2024, comenzamos con la visión de crear una
                  plataforma que simplificara el proceso de adopción y ayudara a
                  más animales a encontrar hogares.
                </p>
                <p className="text-gray-700">
                  Desde entonces, hemos ayudado a cientos de mascotas a
                  encontrar familias amorosas y continuamos creciendo cada día.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Qué Hacemos</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Conectamos adoptantes con refugios y protectoras de animales
                  </li>
                  <li>
                    Facilitamos el proceso de adopción con herramientas
                    digitales
                  </li>
                  <li>
                    Proporcionamos información sobre cuidado responsable de
                    mascotas
                  </li>
                  <li>
                    Apoyamos a refugios con tecnología para gestionar sus
                    operaciones
                  </li>
                  <li>
                    Promovemos la adopción responsable y el bienestar animal
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Nuestros Valores</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Compasión
                    </h4>
                    <p className="text-gray-700">
                      Nos preocupamos profundamente por el bienestar de todos
                      los animales.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Transparencia
                    </h4>
                    <p className="text-gray-700">
                      Operamos con honestidad y claridad en todas nuestras
                      interacciones.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Responsabilidad
                    </h4>
                    <p className="text-gray-700">
                      Promovemos la adopción responsable y el cuidado adecuado
                      de las mascotas.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Contacto</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p className="text-gray-700">
                  ¿Tienes preguntas o quieres colaborar con nosotros?
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Email: info@zoolip.com</li>
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
