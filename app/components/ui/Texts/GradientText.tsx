
import { useEffect, useRef } from "react";

export default function AnimatedComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      const gsapModule = await import("gsap");
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      if (ref.current) {
        gsap.to(ref.current, {
          opacity: 1,
          duration: 1,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        });
      }
    })();
  }, []);

  return <div ref={ref} style={{ opacity: 0 }}>¡Hola animado!</div>;
}

