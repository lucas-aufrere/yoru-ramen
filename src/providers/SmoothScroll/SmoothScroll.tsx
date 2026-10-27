'use client';

import type { ReactNode } from 'react';
import Lenis from 'lenis';
import { useGSAP } from '@gsap/react';

import { gsap, ScrollTrigger } from '@/animations';
import { MOTION_QUERY } from '@/animations/config';

type SmoothScrollProps = {
  children: ReactNode;
};

// Valeurs par défaut de GSAP, restaurées quand Lenis est détruit.
const DEFAULT_LAG_THRESHOLD = 500;
const DEFAULT_LAG_ADJUSTED_DELTA = 33;

/**
 * Initialise Lenis une seule fois, piloté par le ticker GSAP pour n'avoir qu'une boucle rAF.
 * Avec `prefers-reduced-motion`, Lenis n'est pas créé et le scroll reste natif.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERY.full, () => {
      // `anchors` : les liens internes (#carte…) défilent via lenis.scrollTo().
      const lenis = new Lenis({ autoRaf: false, anchors: true });
      const raf = (time: number) => lenis.raf(time * 1000);

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(DEFAULT_LAG_THRESHOLD, DEFAULT_LAG_ADJUSTED_DELTA);
        lenis.destroy();
      };
    });

    // Les fonts chargées modifient la hauteur de la page : les positions des triggers doivent être recalculées.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  });

  return children;
}
