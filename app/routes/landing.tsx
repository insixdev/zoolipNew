import LandingNavbar from "~/components/layout/navbar/LandingNavbar";
import Footer from "~/components/layout/footer/footer";
import Button from "~/components/ui/button/Button&Link/Button";
import GradientText from "~/components/ui/Texts/GradientText";
import LightBackground from "~/components/layout/background/LightBackground";
import BlurText from "~/components/ui/Texts/BlurText";
import AnimatedContent from "~/components/ui/button/AnimatedContent";
import ScrollReveal from "~/components/ui/Texts/ScrollReveal";
import FlowingMenu from "~/components/ui/FlowingMenu";
import SpotlightCard from "~/components/ui/SpotlightCard";
import { ClientOnly } from "~/components/childrenComponents/ClientOnly";
import {
  FiHome,
  FiHeart,
  FiUsers,
  FiSmartphone,
  FiShield,
  FiStar,
} from "react-icons/fi";

const demoItems: Array<{ link: string; text: string; image: string }> = [
  {
    link: "/community",
    text: "Community",
    image: "https://picsum.photos/600/400?random=1",
  },
  {
    link: "/community",
    text: "Adopt Now",
    image: "https://picsum.photos/600/400?random=2",
  },
  {
    link: "/community",
    text: "About Us",
    image: "https://picsum.photos/600/400?random=3",
  },
];

export default function Landing() {
  return (
    <>
      <LandingNavbar floating={true} className="z-50" />

      {/* Hero Section */}
      <div className="relative w-full min-h-screen overflow-visible pt-28">
        <ClientOnly>
          <LightBackground
            className="absolute z-0 w-full h-full top-0 shadow-2xl shadow-slate-950 pointer-events-none"
            rayLength={20}
            saturation={3}
            raysSpeed={2}
          />
        </ClientOnly>

        <div className="relative ml-16 pt-32 pb-16 flex flex-col items-start">
          <GradientText className="text-7xl font-bold">Zoolip</GradientText>

          <ClientOnly>
            <BlurText
              text="Conectando corazones, salvando vidas."
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={() => {}}
              className="text-7xl font-medium mt-2 text-orange-100"
            />
          </ClientOnly>

          <p className="text-3xl mt-4 text-cream-100">
            Unimos rescatistas, veterinarios y familias adoptivas
          </p>
          <p className="text-3xl text-cream-100">
            en una red que da segundas oportunidades.
          </p>
          <p className="text-xl text-cream-100">
            todos podemos ser rescatistas.
          </p>

          <div className="flex gap-4 mt-6">
            <ClientOnly>
              <AnimatedContent
                distance={150}
                direction="horizontal"
                duration={1.2}
                animateOpacity
                onComplete={() => {}}
              >
                <Button
                  size="lg"
                  variant="especial"
                  classNameProps="z-20 bg-orange-200 hover:bg-orange-300 text-black font-semibold"
                  onClick={() => (window.location.href = "/adopt")}
                >
                  Adoptar ahora
                </Button>
              </AnimatedContent>
            </ClientOnly>

            <ClientOnly>
              <AnimatedContent
                distance={150}
                direction="horizontal"
                duration={1.4}
                animateOpacity
                onComplete={() => {}}
              >
                <Button
                  size="lg"
                  variant="especial"
                  classNameProps="z-20 border-orange-200 text-orange-200 hover:bg-orange-200/10"
                  onClick={() => (window.location.href = "/community")}
                >
                  Ser rescatista
                </Button>
              </AnimatedContent>
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Transición suave desde el hero */}
      <div className="h-32 bg-gradient-to-b from-transparent to-black/20"></div>

      <div className="px-16 py-16 bg-gradient-to-b from-black/30 via-orange-900/15 via-amber-900/25 via-orange-800/35 via-amber-800/25 via-orange-900/15 to-black/80">
        {/* ScrollReveal section */}
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
              Transformando vidas juntos, una pata a la vez. Cada rescate es una
              historia de esperanza, cada adopción un nuevo comienzo lleno de
              amor. En Zoolip creemos que salvar una vida cambia dos corazones:
              el suyo y el tuyo. Únete a nuestra misión de crear familias y dar
              segundas oportunidades a quienes más lo necesitan.
            </ScrollReveal>
          </ClientOnly>
        </section>

        {/* CTA rediseñado */}
        <section className="mt-24 mb-32">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br 0/30 rounded-3xl p-16 border border-transparent backdrop-blur-sm relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200/10 to-transparent"></div>

              <div className="relative z-10 text-center">
                <h2
                  className="text-6xl font-bold mb-8 leading-tight"
                  style={{ color: "#d67ca0" }}
                >
                  Tu próximo mejor amigo te está esperando
                </h2>
                <p className="text-2xl text-orange-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                  Cada día que pasa es una oportunidad perdida. Hay miles de
                  corazones esperando encontrar su hogar perfecto. ¿Será el
                  tuyo?
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button
                    size="xl"
                    variant="especial"
                    classNameProps="text-white font-bold px-12 py-4 text-lg"
                    style={{ backgroundColor: "#d67ca0" }}
                    onClick={() => (window.location.href = "/adopt")}
                  >
                    Encontrar mi compañero
                  </Button>
                  <div className="flex items-center gap-3 text-orange-200">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "#d67ca0" }}
                    ></span>
                    <span className="text-lg">
                      Más de 500 animales disponibles
                    </span>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: "#d67ca0" }}
                    >
                      24h
                    </div>
                    <div className="text-orange-200/70 text-sm">
                      Respuesta promedio
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: "#d67ca0" }}
                    >
                      95%
                    </div>
                    <div className="text-orange-200/70 text-sm">
                      Adopciones exitosas
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: "#d67ca0" }}
                    >
                      ∞
                    </div>
                    <div className="text-orange-200/70 text-sm">
                      Amor garantizado
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menú de navegación */}
        <div className="w-full">
          <ClientOnly>
            <FlowingMenu items={demoItems as any} />
          </ClientOnly>
        </div>

        {/* SpotlightCards */}
        <section className="mt-24 mb-24">
          <ClientOnly>
            <div className="grid grid-cols-3 gap-8">
              <SpotlightCard
                className="bg-gradient-to-br from-slate-900/40 via-blue-900/20 to-gray-800/30 border-slate-400/20"
                spotlightColor="rgba(148, 163, 184, 0.25)"
              >
                <div className="h-full flex flex-col justify-between p-6 min-h-[320px]">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                      Rescate con propósito
                    </h3>
                    <p className="text-base text-white/80 leading-relaxed">
                      Cada rescate es una segunda oportunidad. Trabajamos con
                      refugios y rescatistas para dar a cada animal el cuidado
                      que merece.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    classNameProps="border-white/60 text-white/80 hover:bg-white/10 w-fit mt-4"
                    onClick={() => (window.location.href = "/register")}
                  >
                    Ser rescatista
                  </Button>
                </div>
              </SpotlightCard>

              <SpotlightCard
                className="bg-gradient-to-br from-amber-900/40 via-slate-800/20 to-orange-900/30 border-amber-400/20"
                spotlightColor="rgba(245, 158, 11, 0.25)"
              >
                <div className="h-full flex flex-col justify-between p-6 min-h-[320px]">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                      Comunidad unida
                    </h3>
                    <p className="text-base text-white/80 leading-relaxed">
                      Una red de personas comprometidas. Veterinarios,
                      voluntarios y familias trabajando juntos por un futuro
                      mejor.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    classNameProps="border-white/60 text-white/80 hover:bg-white/10 w-fit mt-4"
                    onClick={() => (window.location.href = "/community")}
                  >
                    Únete a nosotros
                  </Button>
                </div>
              </SpotlightCard>

              <SpotlightCard
                className="bg-gradient-to-br from-rose-900/40 via-slate-800/20 to-pink-900/30 border-rose-400/20"
                spotlightColor="rgba(214, 124, 160, 0.25)"
              >
                <div className="h-full flex flex-col justify-between p-6 min-h-[320px]">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                      Adopción responsable
                    </h3>
                    <p className="text-base text-white/80 leading-relaxed">
                      Conectamos familias con su compañero perfecto. Un proceso
                      cuidadoso que garantiza hogares llenos de amor.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    classNameProps="border-white/60 text-white/80 hover:bg-white/10 w-fit mt-4"
                    onClick={() => (window.location.href = "/adopt")}
                  >
                    Adoptar ahora
                  </Button>
                </div>
              </SpotlightCard>
            </div>
          </ClientOnly>
        </section>

        {/* Sección de estadísticas */}
        <section className="mt-32 mb-24 grid grid-cols-1 md:grid-cols-3 gap-12 bg-gradient-to-r from-orange-50/5 via-amber-50/15 to-orange-50/5 rounded-2xl p-12">
          <div className="text-center p-8 bg-gradient-to-b from-orange-100/10 to-amber-100/5 rounded-xl border border-orange-200/20 backdrop-blur-sm">
            <h3 className="text-5xl font-bold text-orange-200 mb-3">500+</h3>
            <p className="text-orange-100/90 text-xl font-medium">
              Animales rescatados
            </p>
          </div>
          <div className="text-center p-8 bg-gradient-to-b from-amber-100/10 to-orange-100/5 rounded-xl border border-amber-200/20 backdrop-blur-sm">
            <h3 className="text-5xl font-bold text-amber-200 mb-3">200+</h3>
            <p className="text-amber-100/90 text-xl font-medium">
              Familias felices
            </p>
          </div>
          <div className="text-center p-8 bg-gradient-to-b from-orange-100/10 to-amber-100/5 rounded-xl border border-amber-200/20 backdrop-blur-sm">
            <h3 className="text-5xl font-bold text-orange-300 mb-3">50+</h3>
            <p className="text-orange-100/90 text-xl font-medium">
              Rescatistas activos
            </p>
          </div>
        </section>
      </div>

      {/* Resto del contenido... */}
      <section className="px-16 py-20 bg-gradient-to-b from-black/80 to-black/90">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-bold text-white mb-4 text-center">
            Todo lo que tenemos para ofrecerte
          </h2>
          <p className="text-xl text-white/70 text-center mb-16 max-w-3xl mx-auto">
            Una plataforma completa que conecta rescatistas, veterinarios y
            familias en una red de amor y segundas oportunidades.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#d67ca0" }}
              >
                <FiHome className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Adopción segura
              </h3>
              <p className="text-white/70">
                Proceso verificado que garantiza el mejor hogar para cada
                animal.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#d67ca0" }}
              >
                <FiHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Red veterinaria
              </h3>
              <p className="text-white/70">
                Acceso a profesionales comprometidos con el bienestar animal.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#d67ca0" }}
              >
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Comunidad activa
              </h3>
              <p className="text-white/70">
                Miles de personas trabajando juntas por el rescate animal.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#d67ca0" }}
              >
                <FiSmartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                App intuitiva
              </h3>
              <p className="text-white/70">
                Interfaz fácil de usar para conectar rápidamente con tu match
                perfecto.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#d67ca0" }}
              >
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Seguimiento completo
              </h3>
              <p className="text-white/70">
                Acompañamos cada paso del proceso de adopción y adaptación.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#d67ca0" }}
              >
                <FiStar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Historias reales
              </h3>
              <p className="text-white/70">
                Testimonios y seguimiento de adopciones exitosas que inspiran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navbar minimalista flotante */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">
              ¿Listo para comenzar?
            </span>
            <Button
              size="sm"
              variant="especial"
              classNameProps="text-white font-semibold rounded-full"
              style={{ backgroundColor: "#d67ca0" }}
              onClick={() => (window.location.href = "/adopt")}
            >
              Comencemos
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
