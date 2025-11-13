import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";

export function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Información del Producto</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Nuestro producto insignia combina tecnología de vanguardia con un
            diseño elegante. Construido con materiales premium, ofrece un
            rendimiento y confiabilidad sin igual.
          </p>
          <p>
            Las características clave incluyen capacidades de procesamiento
            avanzadas y una interfaz de usuario intuitiva diseñada tanto para
            principiantes como para expertos.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Detalles de Envío</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Ofrecemos envío mundial a través de socios de mensajería de
            confianza. La entrega estándar toma de 3 a 5 días hábiles, mientras
            que el envío exprés garantiza la entrega en 1-2 días hábiles.
          </p>
          <p>
            Todos los pedidos se empaquetan cuidadosamente y están totalmente
            asegurados. Rastrea tu envío en tiempo real a través de nuestro
            portal de seguimiento dedicado.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Política de Devolución</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Respaldamos nuestros productos con una política de devolución
            integral de 30 días. Si no estás completamente satisfecho,
            simplemente devuelve el artículo en su condición original.
          </p>
          <p>
            Nuestro proceso de devolución sin complicaciones incluye envío de
            devolución gratuito y reembolsos completos procesados dentro de las
            48 horas posteriores a la recepción del artículo devuelto.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
