import { gsap } from 'gsap';

import { EASE } from './config';

type ScrollOutOptions = {
  trigger: gsap.DOMTarget;
  yPercent?: number;
  scale?: number;
  fade?: boolean;
};

/**
 * Déplace (et éventuellement zoome ou estompe) un élément pendant que sa section
 * quitte le haut du viewport. Le mouvement suit le scroll (scrub).
 */
export function parallaxScrollOut(targets: gsap.TweenTarget, options: ScrollOutOptions) {
  const { trigger, yPercent = 20, scale = 1, fade = false } = options;

  return gsap.to(targets, {
    yPercent,
    scale,
    ...(fade && { autoAlpha: 0 }),
    ease: EASE.none,
    scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: true },
  });
}

type RotateOnScrollOptions = {
  trigger: gsap.DOMTarget;
  rotation?: number;
  start?: string;
  end?: string;
};

/**
 * Fait tourner un élément (badge, sceau) au rythme du scroll, par défaut pendant que sa section
 * quitte le haut du viewport.
 */
export function rotateOnScroll(targets: gsap.TweenTarget, options: RotateOnScrollOptions) {
  const { trigger, rotation = 180, start = 'top top', end = 'bottom top' } = options;

  return gsap.to(targets, {
    rotation,
    ease: EASE.none,
    scrollTrigger: { trigger, start, end, scrub: true },
  });
}

type DriftOptions = {
  /** Tween horizontal du conteneur (ex. retour de `pinHorizontalScroll`). */
  containerAnimation: gsap.core.Animation;
  /** Sélecteur, dans chaque diapositive, de l'élément qui glisse et grossit (ex. le plat). */
  mover: string;
  /** Sélecteur, dans `mover`, de l'élément qui tourne en plus (ex. le bol seul). */
  spinner?: string;
  /** Sélecteur, dans chaque diapositive, de l'élément qui glisse en sens inverse (ex. le fond). */
  counter?: string;
  /** Décalage de `mover` de part et d'autre de son emplacement, en % de sa largeur. */
  shift?: number;
  /** Décalage de `counter`, en sens inverse, en % de sa largeur. */
  counterShift?: number;
  /** Échelle de `mover` au centre de l'écran. */
  zoom?: number;
  /** Rotation de `spinner` au centre de l'écran, en degrés. */
  rotation?: number;
};

/**
 * Dans un défilement horizontal, anime chaque diapositive pendant qu'elle traverse l'écran :
 * `mover` glisse de la droite vers la gauche de son emplacement et grossit jusqu'au centre,
 * `spinner` y tourne légèrement, et `counter` glisse en sens inverse pour accentuer la
 * profondeur. Zoom et rotation culminent au centre puis reviennent à leur état initial.
 */
export function driftAcrossViewport(slides: gsap.DOMTarget, options: DriftOptions) {
  const {
    containerAnimation,
    mover,
    spinner,
    counter,
    shift = 35,
    counterShift = 6,
    zoom = 1.05,
    rotation = 12,
  } = options;

  return gsap.utils.toArray<HTMLElement>(slides).map((slide) => {
    const timeline = gsap.timeline({
      defaults: { ease: EASE.none },
      scrollTrigger: {
        trigger: slide,
        containerAnimation,
        start: 'left right',
        end: 'right left',
        scrub: true,
      },
    });
    const moverElement = slide.querySelector(mover);
    const spinnerElement = spinner ? slide.querySelector(spinner) : null;
    const counterElement = counter ? slide.querySelector(counter) : null;

    if (moverElement) {
      timeline
        .fromTo(moverElement, { xPercent: shift }, { xPercent: -shift, duration: 1 }, 0)
        .to(moverElement, { scale: zoom, duration: 0.5 }, 0)
        .to(moverElement, { scale: 1, duration: 0.5 }, 0.5);
    }

    if (spinnerElement) {
      timeline
        .to(spinnerElement, { rotation, duration: 0.5 }, 0)
        .to(spinnerElement, { rotation: 0, duration: 0.5 }, 0.5);
    }

    if (counterElement) {
      timeline.fromTo(
        counterElement,
        { xPercent: -counterShift },
        { xPercent: counterShift, duration: 1 },
        0,
      );
    }

    return timeline;
  });
}

type ShiftOptions = {
  trigger: gsap.DOMTarget;
  /** Course totale, en % de la hauteur de la cible : positive vers le bas, négative vers le haut. */
  shift: number;
};

/**
 * Décale verticalement les cibles pendant que le déclencheur traverse le viewport, de -shift/2
 * à +shift/2 : elles semblent défiler plus vite (vers le haut) ou plus lentement (vers le bas).
 */
export function parallaxShiftY(targets: gsap.TweenTarget, { trigger, shift }: ShiftOptions) {
  return gsap.fromTo(
    targets,
    { yPercent: -shift / 2 },
    {
      yPercent: shift / 2,
      ease: EASE.none,
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
}
