import { gsap } from 'gsap';

import { MOTION_QUERY } from './config';

// Une variante peut retourner une fonction de nettoyage (ex. retrait d'écouteurs d'événements).
type MotionVariant = () => void | (() => void);

type MotionVariants = {
  full: MotionVariant;
  reduced?: MotionVariant;
};

/**
 * Exécute la variante d'animation correspondant à `prefers-reduced-motion`, éventuellement
 * restreinte à une media query supplémentaire (`when`, ex. un breakpoint de BREAKPOINT_QUERY).
 * Les animations créées dans chaque variante sont annulées si les conditions changent.
 * Retourne l'instance gsap.matchMedia, à révoquer au nettoyage.
 */
export function matchMotion({ full, reduced }: MotionVariants, when?: string) {
  const mm = gsap.matchMedia();
  const restrict = (query: string) => (when ? `${query} and ${when}` : query);

  mm.add(restrict(MOTION_QUERY.full), full);
  if (reduced) mm.add(restrict(MOTION_QUERY.reduced), reduced);

  return mm;
}
