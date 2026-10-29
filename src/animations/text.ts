import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { DURATION, EASE, STAGGER } from './config';

type SplitRevealOptions = {
  stagger?: number;
  delay?: number;
};

/**
 * Découpe le texte en lettres et les fait monter depuis un masque.
 * Le texte reste lisible par les lecteurs d'écran (aria-label posé sur l'élément),
 * et le découpage est annulé au nettoyage du contexte useGSAP.
 */
export function splitCharsReveal(target: gsap.DOMTarget, options: SplitRevealOptions = {}) {
  const { stagger = STAGGER.tight, delay = 0 } = options;

  return SplitText.create(target, {
    type: 'chars',
    mask: 'chars',
    aria: 'auto',
    onSplit: (split) => {
      // L'élément peut être masqué en attendant le JS (lib/motionPending.ts) : ses lettres,
      // désormais cachées sous leur masque, prennent le relais.
      gsap.set(split.elements, { autoAlpha: 1 });

      return gsap.from(split.chars, {
        yPercent: 110,
        duration: DURATION.slow,
        ease: EASE.expo,
        stagger,
        delay,
      });
    },
  });
}

type ColorRevealOptions = {
  start?: string;
  end?: string;
};

/**
 * Découpe le texte en mots et les fait passer de la couleur « éteinte » à leur couleur finale
 * au fil du scroll. La couleur de départ est lue dans la custom property `--reveal-from-color`
 * de l'élément (définie en SCSS), la couleur d'arrivée est celle déjà appliquée à chaque mot.
 * Les mots restent du texte lu normalement par les lecteurs d'écran (aria: 'none').
 */
export function splitWordsColorReveal(target: gsap.DOMTarget, options: ColorRevealOptions = {}) {
  const { start = 'top 80%', end = 'bottom 55%' } = options;

  return SplitText.create(target, {
    type: 'words',
    tag: 'span',
    aria: 'none',
    onSplit: (split) => {
      const [element] = split.elements;
      const fromColor = getComputedStyle(element).getPropertyValue('--reveal-from-color').trim();

      // L'élément peut être masqué en attendant le JS (lib/motionPending.ts) : ses mots,
      // désormais dans leur couleur éteinte, prennent le relais.
      gsap.set(element, { autoAlpha: 1 });

      return gsap.from(split.words, {
        color: fromColor,
        ease: EASE.none,
        stagger: STAGGER.base,
        scrollTrigger: { trigger: element, start, end, scrub: true },
      });
    },
  });
}
