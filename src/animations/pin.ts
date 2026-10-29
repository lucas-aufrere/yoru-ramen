import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { EASE, EXPAND, FOCUS, PIN_LENGTH } from './config';

// Réglages communs aux ScrollTriggers des sections figées : la lecture couvre toute la traversée
// de la section allongée (le cadre collé y reste à l'écran), et les valeurs calculées sont
// réévaluées à chaque recalcul.
const STICKY_TRIGGER = {
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  invalidateOnRefresh: true,
} as const;

type StickyStageOptions = {
  /** Cadre haut d'un écran, enfant de la section, qui reste collé en haut pendant la lecture. */
  stage: HTMLElement;
  /** Distance de scroll pendant laquelle le cadre reste collé, en px. */
  getDistance: () => number;
};

/**
 * Fige le cadre (`stage`) à l'écran pendant `getDistance()` pixels de scroll, par CSS
 * (position: sticky) plutôt que par un épinglage JS : le navigateur le maintient seul en place,
 * sans le saut visible sur mobile quand le JS fixe l'élément avec un temps de retard sur le
 * scroll natif.
 *
 * Pose `data-pinned` sur la section, dont le CSS l'allonge de `--pin-distance` et colle le
 * cadre, et tient cette distance à jour avant chaque recalcul de ScrollTrigger.
 *
 * Exécute `setup` dans un contexte imbriqué, annulé avec celui de l'appelant. Ce contexte
 * n'hérite pas du scope de l'appelant : les sélecteurs doivent être résolus avant l'appel.
 * `onRevert` enregistre un nettoyage supplémentaire.
 */
function withStickyStage<T>(
  section: HTMLElement,
  { getDistance }: StickyStageOptions,
  setup: (onRevert: (cleanup: () => void) => void) => T,
) {
  const cleanups: (() => void)[] = [];
  // Assigné de façon synchrone par gsap.context ci-dessous.
  let result!: T;

  gsap.context(() => {
    const updateDistance = () => {
      section.style.setProperty('--pin-distance', `${getDistance()}px`);
    };

    section.setAttribute('data-pinned', '');
    updateDistance();
    ScrollTrigger.addEventListener('refreshInit', updateDistance);
    result = setup((cleanup) => cleanups.push(cleanup));

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', updateDistance);
      section.style.removeProperty('--pin-distance');
      section.removeAttribute('data-pinned');
      cleanups.forEach((cleanup) => cleanup());
    };
  });

  return result;
}

type PinnedContentOptions = {
  /** Cadre collé, haut d'un écran (voir withStickyStage). */
  stage: HTMLElement;
  /** Contenu qui défile à l'intérieur du cadre, jusqu'à révéler sa fin. */
  content: HTMLElement;
  /** Éléments du contenu mis en avant lorsqu'ils passent au centre de la zone visible. */
  focusItems?: gsap.DOMTarget;
  /** Durée de la lecture, en hauteurs d'écran de scroll. */
  length?: number;
};

/**
 * Fige la section à l'écran et fait défiler son contenu de bout en bout pendant `length`
 * hauteurs d'écran : la vitesse de lecture ne dépend plus de la longueur du contenu.
 * Les positions sont mesurées avec offsetTop : le cadre doit être positionné.
 *
 * Retourne la timeline pilotée par le scroll (durée 1), à compléter avec d'autres animations.
 */
export function pinWithScrollingContent(section: HTMLElement, options: PinnedContentOptions) {
  const { stage, content, focusItems, length = PIN_LENGTH.long } = options;
  const items = focusItems ? gsap.utils.toArray<HTMLElement>(focusItems) : [];
  const getDistance = () => window.innerHeight * length;

  return withStickyStage(section, { stage, getDistance }, (onRevert) => {
    const setItemOpacity = items.map((item) => gsap.quickSetter(item, 'opacity'));

    // Mesures mises en cache à chaque refresh : rien n'est lu dans le DOM pendant le scroll.
    let itemCenters: number[] = [];
    let visibleCenter = 0;
    let falloffDistance = 1;

    const measure = () => {
      // Écart mesuré entre deux rectangles qui subissent la même translation : il n'en dépend pas.
      const contentBox = content.getBoundingClientRect();
      itemCenters = items.map((item) => {
        const box = item.getBoundingClientRect();
        return content.offsetTop + box.top - contentBox.top + box.height / 2;
      });
      visibleCenter = (content.offsetTop + stage.clientHeight) / 2;
      falloffDistance = (stage.clientHeight - content.offsetTop) * FOCUS.falloff;
    };

    const updateFocus = () => {
      const shift = Number(gsap.getProperty(content, 'y'));

      itemCenters.forEach((center, index) => {
        const distance = Math.abs(center + shift - visibleCenter) / falloffDistance;
        setItemOpacity[index](gsap.utils.interpolate(1, FOCUS.dimOpacity, Math.min(distance, 1)));
      });
    };

    onRevert(() => items.forEach((item) => item.style.removeProperty('opacity')));

    const timeline = gsap.timeline({
      defaults: { ease: EASE.none },
      onUpdate: updateFocus,
      scrollTrigger: {
        trigger: section,
        ...STICKY_TRIGGER,
        onRefresh: () => {
          measure();
          updateFocus();
        },
      },
    });

    // Amène le bas du contenu en bas du cadre.
    timeline.to(
      content,
      {
        y: () => -Math.max(0, content.offsetTop + content.offsetHeight - stage.clientHeight),
        duration: 1,
      },
      0,
    );

    return timeline;
  });
}

type HorizontalScrollOptions = {
  /** Cadre collé, haut d'un écran (voir withStickyStage). */
  stage: HTMLElement;
  /** Rangée d'éléments, plus large que le cadre, qui glisse vers la gauche. */
  track: HTMLElement;
};

/**
 * Fige la section à l'écran et transforme le scroll vertical en défilement horizontal de la
 * piste, à vitesse égale : le premier élément est centré à l'écran au début, le dernier à la
 * fin. Un élément de la piste qui reçoit le focus clavier est ramené au centre de l'écran.
 *
 * Retourne le tween horizontal, à passer en `containerAnimation` aux animations des éléments.
 */
export function pinHorizontalScroll(
  section: HTMLElement,
  { stage, track }: HorizontalScrollOptions,
) {
  // Centre d'un élément dans la piste : écart entre deux rectangles qui subissent la même
  // translation, donc indépendant de la position de la piste.
  const getCenterInTrack = (item: Element | null) => {
    if (!item) return 0;
    const box = item.getBoundingClientRect();
    return box.left - track.getBoundingClientRect().left + box.width / 2;
  };
  const getFirstCenter = () => getCenterInTrack(track.firstElementChild);
  const getLastCenter = () => getCenterInTrack(track.lastElementChild);
  const getDistance = () => Math.max(0, getLastCenter() - getFirstCenter());

  return withStickyStage(section, { stage, getDistance }, (onRevert) => {
    const tween = gsap.fromTo(
      track,
      { x: () => stage.clientWidth / 2 - getFirstCenter() },
      {
        x: () => stage.clientWidth / 2 - getLastCenter(),
        ease: EASE.none,
        scrollTrigger: { trigger: section, ...STICKY_TRIGGER },
      },
    );

    // Sans cela, la navigation au clavier atteindrait des éléments restés hors de l'écran.
    const revealFocusedItem = (event: FocusEvent) => {
      const scrollTrigger = tween.scrollTrigger;
      const item = Array.from(track.children).find((child) => child.contains(event.target as Node));
      if (!scrollTrigger || !item) return;

      const progress = gsap.utils.clamp(
        0,
        1,
        (getCenterInTrack(item) - getFirstCenter()) / getDistance(),
      );

      window.scrollTo({
        top: scrollTrigger.start + progress * (scrollTrigger.end - scrollTrigger.start),
        behavior: 'instant',
      });
    };

    track.addEventListener('focusin', revealFocusedItem);
    onRevert(() => track.removeEventListener('focusin', revealFocusedItem));

    return tween;
  });
}

type ExpandingMediaOptions = {
  /** Cadre collé, haut d'un écran (voir withStickyStage). */
  stage: HTMLElement;
  /** Média qui grandit depuis le centre jusqu'à remplir le cadre. */
  media: HTMLElement;
  /** Légende qui apparaît une fois le média plein écran. */
  caption: HTMLElement;
  /**
   * Appelée quand le média commence à grandir (true), puis quand la section a quitté l'écran
   * ou qu'on remonte avant le début de l'agrandissement (false) : ex. lecture d'une vidéo.
   */
  onMediaVisibilityChange?: (visible: boolean) => void;
  /** Durée de la lecture, en hauteurs d'écran de scroll. */
  length?: number;
};

/**
 * Fige la section : le média, invisible au départ, grandit au rythme du scroll jusqu'à remplir
 * l'écran ; la légende monte alors en fondu, avant une courte pause plein écran.
 */
export function pinExpandingMedia(section: HTMLElement, options: ExpandingMediaOptions) {
  const { stage, media, caption, onMediaVisibilityChange, length = PIN_LENGTH.base } = options;
  const getDistance = () => window.innerHeight * length;

  return withStickyStage(section, { stage, getDistance }, (onRevert) => {
    const timeline = gsap
      .timeline({
        defaults: { ease: EASE.none },
        scrollTrigger: { trigger: section, ...STICKY_TRIGGER },
      })
      .fromTo(media, { scale: 0 }, { scale: 1, duration: EXPAND.grow }, 0)
      .fromTo(
        caption,
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, duration: EXPAND.caption, ease: EASE.out },
        EXPAND.captionAt,
      )
      // Pause finale, média plein écran, avant que la section ne reprenne son défilement.
      .set({}, {}, 1);

    if (onMediaVisibilityChange) {
      // Du début de l'agrandissement jusqu'à la sortie complète de la section.
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        onToggle: (self) => onMediaVisibilityChange(self.isActive),
      });
      onRevert(() => onMediaVisibilityChange(false));
    }

    return timeline;
  });
}
