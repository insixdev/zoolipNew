import { useEffect, useState } from "react";

// Wrapper para LightBackground
export function ClientLightBackground(props: any) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    console.log("Loading LightBackground...");
    import("~/components/layout/background/LightBackground")
      .then((mod) => {
        console.log("LightBackground loaded!");
        setComponent(() => mod.default);
      })
      .catch((err) => {
        console.error("Error loading LightBackground:", err);
      });
  }, []);

  if (!Component) {
    console.log("LightBackground not loaded yet");
    return null;
  }
  
  console.log("Rendering LightBackground");
  return <Component {...props} />;
}

// Wrapper para BlurText
export function ClientBlurText(props: any) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import("~/components/ui/Texts/BlurText").then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) return <div className={props.className}>{props.text}</div>;
  return <Component {...props} />;
}

// Wrapper para AnimatedContent
export function ClientAnimatedContent(props: any) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    console.log("Loading AnimatedContent...");
    import("~/components/ui/button/AnimatedContent")
      .then((mod) => {
        console.log("AnimatedContent loaded!");
        setComponent(() => mod.default);
      })
      .catch((err) => {
        console.error("Error loading AnimatedContent:", err);
      });
  }, []);

  if (!Component) {
    console.log("AnimatedContent not loaded yet, showing fallback");
    return <>{props.children}</>;
  }
  
  console.log("Rendering AnimatedContent");
  return <Component {...props} />;
}

// Wrapper para ScrollReveal
export function ClientScrollReveal(props: any) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import("~/components/ui/Texts/ScrollReveal").then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) return <div className={props.containerClassName + " " + props.textClassName}>{props.children}</div>;
  return <Component {...props} />;
}

// Wrapper para FlowingMenu
export function ClientFlowingMenu(props: any) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import("~/components/ui/FlowingMenu").then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) return null;
  return <Component {...props} />;
}

// Wrapper para SpotlightCard
export function ClientSpotlightCard(props: any) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import("~/components/ui/SpotlightCard").then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) return <div className={props.className}>{props.children}</div>;
  return <Component {...props} />;
}
