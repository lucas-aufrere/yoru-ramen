import { gsap } from 'gsap';

import { DURATION, EASE, STAGGER } from './config';

type RevealOptions = {
  y?: number;
  stagger?: number;
  delay?: number;
  start?: string;
  /** `false` pour une apparition immédiate (contenu au-dessus de la ligne de flottaison). */
  scroll?: boolean;
};

/**
 * Fait apparaître les éléments en fondu depuis le bas, à leur entrée dans le viewport
 * ou immédiatement si `scroll` vaut `false`.
 */
export function revealFadeUp(targets: gsap.TweenTarget, options: RevealOptions = {}) {
  const { y = 40, stagger = STAGGER.base, delay = 0, start = 'top 85%', scroll = true } = options;

  return gsap.from(targets, {
    autoAlpha: 0,
    y,
    duration: DURATION.base,
    ease: EASE.out,
    stagger,
    delay,
    scrollTrigger: scroll ? { trigger: targets as gsap.DOMTarget, start } : undefined,
  });
}

type FadeOutOptions = {
  trigger: gsap.DOMTarget;
  start?: string;
  /** Fin du fondu ; `+=20%` : après un cinquième de hauteur d'écran de scroll. */
  end?: string;
};

/**
 * Estompe les éléments au tout début du scroll de leur déclencheur (ex. une indication
 * « scrollez » qui n'a plus lieu d'être une fois le mouvement lancé).
 */
export function fadeOutOnScroll(targets: gsap.TweenTarget, options: FadeOutOptions) {
  const { trigger, start = 'top top', end = '+=20%' } = options;

  return gsap.to(targets, {
    autoAlpha: 0,
    ease: EASE.none,
    scrollTrigger: { trigger, start, end, scrub: true },
  });
}

/**
 * Apparition courte d'un contenu qui vient d'en remplacer un autre (ex. changement d'onglet).
 * Repart toujours de zéro, même si une apparition précédente est encore en cours.
 */
export function revealSwap(targets: gsap.TweenTarget) {
  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y: 16 },
    {
      autoAlpha: 1,
      y: 0,
      duration: DURATION.fast,
      ease: EASE.out,
      stagger: STAGGER.tight,
      overwrite: true,
    },
  );
}

type CascadeOptions = {
  start?: string;
};

/**
 * Fait monter les éléments depuis le bas jusqu'à leur place, l'un après l'autre (en cascade),
 * à leur entrée dans le viewport.
 */
export function revealCascade(targets: gsap.TweenTarget, options: CascadeOptions = {}) {
  const { start = 'top 85%' } = options;

  return gsap.from(targets, {
    autoAlpha: 0,
    yPercent: 60,
    duration: DURATION.slow,
    ease: EASE.expo,
    stagger: STAGGER.loose,
    scrollTrigger: { trigger: targets as gsap.DOMTarget, start },
  });
}
