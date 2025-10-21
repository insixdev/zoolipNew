import { Navbar } from "~/components/layout/navbar";
import LightBackground from "~/components/layout/background/LightBackground";
import GradientText from "~/components/ui/Texts/GradientText";
import BlurText from "~/components/ui/Texts/BlurText";
import AnimatedContent from "~/components/ui/button/AnimatedContent";
import ScrollReveal from "~/components/ui/Texts/ScrollReveal";
import FlowingMenu from "~/components/ui/FlowingMenu";
import Button from "~/components/ui/button/Button";
//
// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

const demoItems = [
  { link: '/comunidad', text: 'Comunidad', image: 'https://picsum.photos/600/400?random=1' },
  { link: '/adoptar', text: 'Sucias', image: 'https://picsum.photos/600/400?random=2' },
  { link: '/about', text: 'Acerca', image: 'https://picsum.photos/600/400?random=3' },
];

export default function Home() {
  return ( 
    <>
      {/* Navbar fijo */}
      <Navbar className="absolute z-10"/>
      {/* Hero con fondo de LightBackground */}
      <div className="relative w-full min-h-screen overflow-visible pt-20"> 
        {/* pt-20 para que el Navbar no tape el contenido */}
        <LightBackground
          lightSpread={1.5}
          raysColor="#deb597"
          noiseAmount={0.05}
          rayLength={4}
          fadeDistance={1.6}
          distortion={0.02}
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        />

        <div className="relative  ml-16 pt-32 pb-16 md:px-4 lg:px-4 xl:px-4 flex flex-col items-start ">
          {/* Título */}
          <GradientText
            colors={["#ffffaa", "#ffaa40", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={7}
            showBorder={true}
            className="text-7xl font-bold"
          >
            Zoolip
          </GradientText>

          {/* Subtítulo animado */}
          <BlurText
            text="Una solución que salva vidas."
            delay={150}
            onAnimationComplete={console.log("bitch")}
            animateBy="words"
            direction="top"
            className="text-7xl font-medium mt-2"
          />
          <p className="text-3xl mt-4"> Nuestra app conecta rescatistas, veterinarias y familias </p>
          <p className="text-3xl"> para transformar el futuro de cada perro </p>
          {/* Botón principal */}
          <AnimatedContent
            distance={150}
            onComplete={console.log("animatedcontent has been done")}
            direction="horizontal"
            duration={1.2}
            animateOpacity
          >

            <Button size="md" variant="especial" classNameProps="z-20 mt-2">Salva perras</Button>
          </AnimatedContent>

        </div>
      </div>
      {/* Secciones normales scrollable */}
      <div className="px-16 py-16">
        {/* FlowingMenu */}
        <div className="pt-32 w-full">
          <FlowingMenu items={demoItems} />
        </div>

        {/* Contenido adicional */}
        <p className="text-6xl mt-32">
          Las perras de este lugar esta de locos
        </p>
        <section>
          <ScrollReveal
            scrollContainerRef={window}
            baseOpacity={0}
            enableBlur
            baseRotation={5}
            blurStrength={10}
            containerClassName="mt-12 mb-32"
          >
            ¿Cuándo muere una mascota?
            ¿Cuando la atropella un auto? ¡No!
            ¿Cuando enferma? ¡No!
            ¿Cuando come algo venenoso? ¡No!
            Una mascota muere cuando es olvidada.
            Con nuestra comunidad, nunca más estarán solas ni olvidadas. 
          </ScrollReveal>
        </section>
      </div>
    </>

  );
}
