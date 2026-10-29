import { gsap } from 'gsap';

import { DURATION, EASE, TILT } from './config';

type TiltOptions = {
  /** Inclinaison maximale, en degrés, quand le curseur atteint un bord. */
  angle?: number;
};

/**
 * Incline chaque cible en 3D selon la position du curseur qui la survole : le point visé
 * s'enfonce, donnant une impression de profondeur. Seule la cible survolée bouge ; elle revient
 * à plat quand le curseur la quitte. Retourne une fonction qui retire les écouteurs.
 */
export function tiltOnPointer(targets: gsap.DOMTarget, options: TiltOptions = {}) {
  const { angle = TILT.angle } = options;

  const cleanups = gsap.utils.toArray<HTMLElement>(targets).map((target) => {
    // Position du curseur mesurée sur le parent, qui ne s'incline pas : mesurée sur la cible,
    // l'inclinaison modifierait la mesure, qui modifierait l'inclinaison… et la carte tremblerait.
    const frame = target.parentElement ?? target;
    let flattenCall: gsap.core.Tween | undefined;

    gsap.set(target, { transformPerspective: TILT.perspective });
    // quickTo réutilise un même tween à chaque mouvement au lieu d'en créer un nouveau.
    const toRotationX = gsap.quickTo(target, 'rotationX', {
      duration: DURATION.fast,
      ease: EASE.out,
    });
    const toRotationY = gsap.quickTo(target, 'rotationY', {
      duration: DURATION.fast,
      ease: EASE.out,
    });

    // Pendant le survol, la carte a son propre calque : dessinée une fois à plat puis inclinée
    // d'un bloc, ses bordures fines restent nettes au lieu de scintiller à chaque image.
    const handleEnter = () => {
      flattenCall?.kill();
      gsap.set(target, { willChange: 'transform' });
    };

    const handleMove = (event: PointerEvent) => {
      const box = frame.getBoundingClientRect();
      // Position du curseur, de -1 (bord gauche / haut) à 1 (bord droit / bas).
      const x = ((event.clientX - box.left) / box.width) * 2 - 1;
      const y = ((event.clientY - box.top) / box.height) * 2 - 1;

      toRotationY(x * angle);
      toRotationX(-y * angle);
    };

    const handleLeave = () => {
      toRotationX(0);
      toRotationY(0);
      // Le calque dédié n'est retiré qu'une fois la carte revenue à plat.
      flattenCall = gsap.delayedCall(DURATION.fast, () => {
        gsap.set(target, { willChange: 'auto' });
      });
    };

    target.addEventListener('pointerenter', handleEnter);
    target.addEventListener('pointermove', handleMove);
    target.addEventListener('pointerleave', handleLeave);

    return () => {
      flattenCall?.kill();
      target.removeEventListener('pointerenter', handleEnter);
      target.removeEventListener('pointermove', handleMove);
      target.removeEventListener('pointerleave', handleLeave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
