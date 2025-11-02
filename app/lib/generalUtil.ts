import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
// esta funcion sirve para dar estilos a los componentes
// resuelve conflictos de estilos entre componentes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
