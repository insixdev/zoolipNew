import { Navbar } from "~/components/layout/navbar";
import Footer from "~/components/layout/footer/footer";
import LightBackground from "~/components/layout/background/LightBackground";
import ScrollReveal from "~/components/ui/Texts/ScrollReveal";
import SpotlightCard from "~/components/ui/SpotlightCard";
import Carousel from "~/components/ui/Carousel";
import FlowingMenu from "~/components/ui/FlowingMenu";
import Button from "~/components/ui/button/Button&Link/Button";
import { ClientOnly } from "~/components/childrenComponents/ClientOnly";
import BlurText from "~/components/ui/Texts/BlurText";
import AnimatedContent from "~/components/ui/button/AnimatedContent";
import GradientText from "~/components/ui/Texts/GradientText";
import { FiHome, FiHeart, FiUsers, FiSmartphone, FiShield, FiStar } from "react-icons/fi";

const demoItems = [
  { link: '/community', text: 'Community', image: 'https://picsum.photos/600/400?random=1' },
  { link: '/adopt', text: 'Adopt Now', image: 'https://picsum.photos/600/400?random=2' },
  { link: '/about', text: 'About Us', image: 'https://picsum.photos/600/400?random=3' },
];

const rescuedDogs = [
  {
    title: 'Luna',
    description: 'Rescatada de las calles, ahora vive feliz con su nueva familia.',
    id: 1,
    icon: <span className="text-2xl">🐕</span>
  },
  {
    title: 'Max',
    description: 'Abandonado en un parque, encontró el amor en su nuevo hogar.',
    id: 2,
    icon: <span className="text-2xl">🦮</span>
  },
  {
    title: 'Bella',
    description: 'De refugio a princesa, su transformación es increíble.',
    id: 3,
    icon: <span className="text-2xl">🐶</span>
  },
  {
    title: 'Rocky',
    description: 'Herido y asustado, ahora es el guardián de su familia.',
    id: 4,
    icon: <span className="text-2xl">🐕‍🦺</span>
  },
  {
    title: 'Coco',
    description: 'Pequeña pero valiente, conquistó corazones desde el día uno.',
    id: 5,
    icon: <span className="text-2xl">🐩</span>
  }
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
            {/* Título principal con gradiente */}
            <GradientText className="text-7xl font-bold">
              Zoolip
            </GradientText>
            
            {/* Subtítulo con animación */}
            <BlurText
              text="Conectando corazones, salvando vidas."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-7xl font-medium mt-2 text-orange-100"
            />
            
            {/* Descripción principal */}
            <p className="text-3xl mt-4 text-cream-100">
              Unimos rescatistas, veterinarios y familias adoptivas
            </p>
            <p className="text-3xl text-cream-100">
              en una red que da segundas oportunidades
            </p>
            
            {/* Botones de acción principal - CTA mejorado */}
            <div className="flex gap-4 mt-6">
              <AnimatedContent
                distance={150}
                direction="horizontal"
                duration={1.2}
                animateOpacity
              >
                <Button size="lg" variant="especial" classNameProps="z-20 bg-orange-200 hover:bg-orange-300 text-black font-semibold">
                  Adoptar ahora
                </Button>
              </AnimatedContent>
              
              <AnimatedContent
                distance={150}
                direction="horizontal"
                duration={1.4}
                animateOpacity
              >
                <Button size="lg" variant="outline" classNameProps="z-20 border-orange-200 text-orange-200 hover:bg-orange-200/10">
                  Ser rescatista
                </Button>
              </AnimatedContent>
            </div>
          </ClientOnly>
        </div>
      </div>
      
      {/* Transición suave desde el hero */}
      <div className="h-32 bg-gradient-to-b from-transparent to-black/20"></div>
      
      <div className="px-16 py-16 bg-gradient-to-b from-black/30 via-orange-900/15 via-amber-900/25 via-orange-800/35 via-amber-800/25 via-orange-900/15 to-black/80">
        {/* ScrollReveal movido más arriba con más contenido */}
        <section className="pt-8 pb-12">
          <ClientOnly>
            <ScrollReveal
              scrollContainerRef={typeof window !== "undefined" ? window : null}
              baseOpacity={0.1}
              enableBlur
              baseRotation={2}
              blurStrength={6}
              containerClassName="mb-16 text-center max-w-5xl mx-auto"
              textClassName="text-white font-semibold"
            >
              Transformando vidas juntos, una pata a la vez. Cada rescate es una historia de esperanza, 
              cada adopción un nuevo comienzo lleno de amor. En Zoolip creemos que salvar una vida 
              cambia dos corazones: el suyo y el tuyo. Únete a nuestra misión de crear familias 
              y dar segundas oportunidades a quienes más lo necesitan.
            </ScrollReveal>
          </ClientOnly>
        </section>

        {/* CTA rediseñado con orange-200 */}
        <section className="mt-24 mb-32">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br 0/30 rounded-3xl p-16 border border-transparent backdrop-blur-sm relative overflow-hidden shadow-2xl">
              {/* Decoración de fondo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200/10 to-transparent"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-6xl font-bold mb-8 leading-tight" style={{color: '#d67ca0'}}>
                  Tu próximo mejor amigo te está esperando
                </h2>
                <p className="text-2xl text-orange-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                  Cada día que pasa es una oportunidad perdida. Hay miles de corazones esperando 
                  encontrar su hogar perfecto. ¿Será el tuyo?
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button size="xl" variant="especial" classNameProps="text-white font-bold px-12 py-4 text-lg" style={{backgroundColor: '#d67ca0'}}>
                    Encontrar mi compañero
                  </Button>
                  <div className="flex items-center gap-3 text-orange-200">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#d67ca0'}}></span>
                    <span className="text-lg">Más de 500 animales disponibles</span>
                  </div>
                </div>
                
                {/* Estadísticas rápidas */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{color: '#d67ca0'}}>24h</div>
                    <div className="text-orange-200/70 text-sm">Respuesta promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{color: '#d67ca0'}}>95%</div>
                    <div className="text-orange-200/70 text-sm">Adopciones exitosas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{color: '#d67ca0'}}>∞</div>
                    <div className="text-orange-200/70 text-sm">Amor garantizado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menú de navegación con elementos */}
        <div className="w-full">
          <FlowingMenu items={demoItems} />
        </div>


        
        {/* Tres SpotlightCards con colores combinados */}
        <section className="mt-32 mb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <ClientOnly>
            {/* Card 1 - Rescate */}
            <SpotlightCard 
              className="bg-gradient-to-br from-slate-900/40 via-blue-900/20 to-gray-800/30 border-slate-400/20"
              spotlightColor="rgba(148, 163, 184, 0.25)"
            >
              <div className="h-full flex flex-col justify-between m-4">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                    Rescate con propósito
                  </h3>
                  <p className="text-xl text-white/80 leading-relaxed mb-4">
                    Cada rescate es una segunda oportunidad. Trabajamos con refugios y rescatistas 
                    para dar a cada animal el cuidado que merece. Nuestra red de voluntarios 
                    está comprometida con brindar atención médica, refugio temporal y amor 
                    incondicional hasta encontrar el hogar perfecto.
                  </p>
                </div>
                <Button size="sm" variant="outline" classNameProps="border-white/60 text-white/80 hover:bg-white/10 w-fit mt-6">
                  Ser rescatista
                </Button>
              </div>
            </SpotlightCard>

            {/* Card 2 - Comunidad (movida al centro por ser más naranja) */}
            <SpotlightCard 
              className="bg-gradient-to-br from-amber-900/40 via-slate-800/20 to-orange-900/30 border-amber-400/20"
              spotlightColor="rgba(245, 158, 11, 0.25)"
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                    Comunidad unida
                  </h3>
                  <p className="text-xl text-white/80 leading-relaxed">
                    Una red de personas comprometidas. Veterinarios, voluntarios y familias 
                    trabajando juntos por un futuro mejor.
                  </p>
                </div>
                <Button size="sm" variant="outline" classNameProps="border-white/60 text-white/80 hover:bg-white/10 w-fit mt-6">
                  Únete a nosotros
                </Button>
              </div>
            </SpotlightCard>

            {/* Card 3 - Adopción */}
            <SpotlightCard 
              className="bg-gradient-to-br from-rose-900/40 via-slate-800/20 to-pink-900/30 border-rose-400/20"
              spotlightColor="rgba(214, 124, 160, 0.25)"
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                    Adopción responsable
                  </h3>
                  <p className="text-xl text-white/80 leading-relaxed">
                    Conectamos familias con su compañero perfecto. Un proceso cuidadoso 
                    que garantiza hogares llenos de amor.
                  </p>
                </div>
                <Button size="sm" variant="outline" classNameProps="border-white/60 text-white/80 hover:bg-white/10 w-fit mt-6">
                  Adoptar ahora
                </Button>
              </div>
            </SpotlightCard>
          </ClientOnly>
        </section>
        
        {/* Sección de estadísticas */}
        <section className="mt-32 mb-24 grid grid-cols-1 md:grid-cols-3 gap-12 bg-gradient-to-r from-orange-50/5 via-amber-50/15 to-orange-50/5 rounded-2xl p-12">
          <div className="text-center p-8 bg-gradient-to-b from-orange-100/10 to-amber-100/5 rounded-xl border border-orange-200/20 backdrop-blur-sm">
            <h3 className="text-5xl font-bold text-orange-200 mb-3">500+</h3>
            <p className="text-orange-100/90 text-xl font-medium">Animales rescatados</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-b from-amber-100/10 to-orange-100/5 rounded-xl border border-amber-200/20 backdrop-blur-sm">
            <h3 className="text-5xl font-bold text-amber-200 mb-3">200+</h3>
            <p className="text-amber-100/90 text-xl font-medium">Familias felices</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-b from-orange-100/10 to-amber-100/5 rounded-xl border border-orange-200/20 backdrop-blur-sm">
            <h3 className="text-5xl font-bold text-orange-300 mb-3">50+</h3>
            <p className="text-orange-100/90 text-xl font-medium">Rescatistas activos</p>
          </div>
        </section>
        

      </div>
      
      {/* Sección "Todo lo que tenemos para ofrecerte" estilo Airbnb */}
      <section className="px-16 py-20 bg-gradient-to-b from-black/80 to-black/90">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-bold text-white mb-4 text-center">
            Todo lo que tenemos para ofrecerte
          </h2>
          <p className="text-xl text-white/70 text-center mb-16 max-w-3xl mx-auto">
            Una plataforma completa que conecta rescatistas, veterinarios y familias en una red de amor y segundas oportunidades.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#d67ca0'}}>
                <FiHome className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Adopción segura</h3>
              <p className="text-white/70">Proceso verificado que garantiza el mejor hogar para cada animal.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#d67ca0'}}>
                <FiHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Red veterinaria</h3>
              <p className="text-white/70">Acceso a profesionales comprometidos con el bienestar animal.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#d67ca0'}}>
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Comunidad activa</h3>
              <p className="text-white/70">Miles de personas trabajando juntas por el rescate animal.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#d67ca0'}}>
                <FiSmartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">App intuitiva</h3>
              <p className="text-white/70">Interfaz fácil de usar para conectar rápidamente con tu match perfecto.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#d67ca0'}}>
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Seguimiento completo</h3>
              <p className="text-white/70">Acompañamos cada paso del proceso de adopción y adaptación.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#d67ca0'}}>
                <FiStar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Historias reales</h3>
              <p className="text-white/70">Testimonios y seguimiento de adopciones exitosas que inspiran.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navbar minimalista flotante - siempre visible */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">¿Listo para comenzar?</span>
            <Button size="sm" variant="especial" classNameProps="text-white font-semibold rounded-full" style={{backgroundColor: '#d67ca0'}}>
              Comencemos
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
}

