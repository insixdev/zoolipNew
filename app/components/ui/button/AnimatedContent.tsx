
import { useRef, useEffect } from "react";
import { safeGsapImport } from "~/lib/generalUtil";

const AnimatedContent = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function initAnimation() {
      console.log("AnimatedContent: initAnimation called");
      if (typeof window === "undefined") {
        console.log("AnimatedContent: window is undefined, skipping");
        return;
      }

      const gsap = await safeGsapImport();
      console.log("AnimatedContent: GSAP loaded:", !!gsap);
      if (!gsap || isCancelled) return;

      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const el = ref.current;
      console.log("AnimatedContent: element ref:", !!el);
      if (!el) return;

      const axis = direction === "horizontal" ? "x" : "y";
      const offset = reverse ? -distance : distance;
      const startPct = (1 - threshold) * 100;

      gsap.set(el, {
        [axis]: offset,
        scale,
        opacity: animateOpacity ? initialOpacity : 1,
      });

      gsap.to(el, {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease,
        delay,
        onComplete,
        scrollTrigger: {
          trigger: el,
          start: `top ${startPct}%`,
          toggleActions: "play none none none",
          once: true,
        },
      });
    }

    initAnimation();

    return () => {
      isCancelled = true;
      // no killScrollTrigger en cleanup porque el import puede no haber ocurrido todavía
    };
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    onComplete,
  ]);

  return <div ref={ref}>{children}</div>;
};

export default AnimatedContent;

