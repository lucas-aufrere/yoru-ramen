import { gsap } from 'gsap';

import { EASE } from './config';

type MarqueeOptions = {
  trigger: gsap.DOMTarget;
  /** Déplacement total, en pourcentage de la largeur de la piste. */
  distance?: number;
  /** `true` pour défiler vers la droite. */
  reverse?: boolean;
};

/**
 * Fait défiler horizontalement la piste d'un bandeau au rythme du scroll.
 * Le mouvement n'avance que si l'utilisateur fait défiler la page : rien ne bouge tout seul.
 */
export function marqueeOnScroll(track: gsap.TweenTarget, options: MarqueeOptions) {
  const { trigger, distance = 25, reverse = false } = options;
  const [from, to] = reverse ? [-distance, 0] : [0, -distance];

  return gsap.fromTo(
    track,
    { xPercent: from },
    {
      xPercent: to,
      ease: EASE.none,
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
}
