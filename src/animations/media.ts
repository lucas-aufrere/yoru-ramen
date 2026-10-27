import { gsap } from 'gsap';

import { EASE } from './config';

/** Lecteur piloté par une progression (ex. le composant ImageSequence). */
export type SeekablePlayer = {
  seek: (progress: number) => void;
};

/**
 * Fait avancer un lecteur de 0 à 1, sur une durée de 1.
 * À placer dans une timeline pilotée par le scroll (ex. celle de `pinWithScrollingContent`).
 */
export function playSequence(player: SeekablePlayer) {
  const playhead = { progress: 0 };

  return gsap.to(playhead, {
    progress: 1,
    duration: 1,
    ease: EASE.none,
    onUpdate: () => player.seek(playhead.progress),
  });
}
