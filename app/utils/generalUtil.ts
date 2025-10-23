/**for gsap safe client rendering*/

export async function safeGsapImport() {
  if (typeof window === "undefined") return null;

  try {
    const gsapModule = await import("gsap");
    return gsapModule.gsap || gsapModule.default || gsapModule;
  } catch (err) {
    console.warn("GSAP not available", err);
    return null;
  }
}

