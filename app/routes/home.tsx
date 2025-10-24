import { Navbar } from "~/components/layout/navbar";
import LightBackground from "~/components/layout/background/LightBackground";
import ScrollReveal from "~/components/ui/Texts/ScrollReveal";
import FlowingMenu from "~/components/ui/FlowingMenu";
import Button from "~/components/ui/button/Button&Link/Button";
import { ClientOnly } from "~/components/childrenComponents/ClientOnly";
import BlurText from "~/components/ui/Texts/BlurText";
import AnimatedContent from "~/components/ui/button/AnimatedContent";
import GradientText from "~/components/ui/Texts/GradientText";

const demoItems = [
  { link: '/comunidad', text: 'Comunidad', image: 'https://picsum.photos/600/400?random=1' },
  { link: '/adoptar', text: 'Sucias', image: 'https://picsum.photos/600/400?random=2' },
  { link: '/about', text: 'Acerca', image: 'https://picsum.photos/600/400?random=3' },
];

export default function Home() {
  return (
    <>
      <Navbar className="absolute z-11" />
      <div className="relative w-full min-h-screen overflow-visible pt-20">
        <ClientOnly>
          <LightBackground
            lightSpread={1.5}
            raysColor="#deb597"
            noiseAmount={0.05}
            rayLength={4}
            fadeDistance={1.6}
            distortion={0.02}
            className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
          />
        </ClientOnly>
        
        <div className="relative ml-16 pt-32 pb-16 flex flex-col items-start">
          <ClientOnly>
            <GradientText className="text-7xl font-bold">
              Zoolip
            </GradientText>
            
            <BlurText
              text="Una solución que salva vidas."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-7xl font-medium mt-2"
            />
            
            <p className="text-3xl mt-4">
              Nuestra app conecta rescatistas, veterinarias y familias
            </p>
            <p className="text-3xl">
              para transformar el futuro de cada perro
            </p>
            
            <AnimatedContent
              distance={150}
              direction="horizontal"
              duration={1.2}
              animateOpacity
            >
              <Button size="md" variant="especial" classNameProps="z-20 mt-2">
                Salva perras
              </Button>
            </AnimatedContent>
          </ClientOnly>
        </div>
      </div>
      
      <div className="px-16 py-16">
        <div className="pt-32 w-full">
          <FlowingMenu items={demoItems} />
        </div>
        
        <p className="text-6xl mt-32">
          Las perras de este lugar están de locos
        </p>
        
        <section>
          <ClientOnly>
            <ScrollReveal
              scrollContainerRef={typeof window !== "undefined" ? window : null}
              baseOpacity={0}
              enableBlur
              baseRotation={5}
              blurStrength={10}
              containerClassName="mt-12 mb-32"
            >
              ¿Cuándo muere una mascota? ¿Cuando la atropella un auto? ¡No!
              ¿Cuando enferma? ¡No! ¿Cuando come algo venenoso? ¡No!
              Una mascota muere cuando es olvidada.
              Con nuestra comunidad, nunca más estarán solas ni olvidadas.
            </ScrollReveal>
          </ClientOnly>
        </section>
      </div>
    </>
  );
}

