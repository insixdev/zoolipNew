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
// PARA LA PUTA FECHAAAAAAA
export function toLocalISOString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
