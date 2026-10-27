import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { EASE, EXPAND, FOCUS, PIN_LENGTH } from './config';

/**
 * Exécute `setup` dans un contexte imbriqué, annulé avec celui de l'appelant, et pose
 * `data-pinned` sur la section le temps de l'animation pour que son CSS passe en mise en page
 * épinglée. `onRevert` enregistre un nettoyage supplémentaire.
 *
 * Le contexte imbriqué n'hérite pas du scope de l'appelant : les sélecteurs doivent être
 * résolus avant l'appel.
 */
function withPinnedLayout<T>(
  section: HTMLElement,
  setup: (onRevert: (cleanup: () => void) => void) => T,
) {
  const cleanups: (() => void)[] = [];
  // Assigné de façon synchrone par gsap.context ci-dessous.
  let result!: T;

  gsap.context(() => {
    section.setAttribute('data-pinned', '');
    result = setup((cleanup) => cleanups.push(cleanup));

    return () => {
      section.removeAttribute('data-pinned');
      cleanups.forEach((cleanup) => cleanup());
    };
  });

  return result;
}

type PinnedContentOptions = {
  /** Contenu qui défile à l'intérieur de la section épinglée, jusqu'à révéler sa fin. */
  content: HTMLElement;
  /** Éléments du contenu mis en avant lorsqu'ils passent au centre de la zone visible. */
  focusItems?: gsap.DOMTarget;
  /** Durée de l'épinglage, en hauteurs d'écran de scroll. */
  length?: number;
};

/**
 * Épingle la section en haut de l'écran et fait défiler son contenu de bout en bout pendant
 * `length` hauteurs d'écran : la vitesse de lecture ne dépend plus de la longueur du contenu.
 * Les positions sont mesurées avec offsetTop : la section doit être positionnée.
 *
 * Retourne la timeline pilotée par le scroll (durée 1), à compléter avec d'autres animations.
 */
export function pinWithScrollingContent(section: HTMLElement, options: PinnedContentOptions) {
  const { content, focusItems, length = PIN_LENGTH.long } = options;
  const items = focusItems ? gsap.utils.toArray<HTMLElement>(focusItems) : [];

  return withPinnedLayout(section, (onRevert) => {
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
      visibleCenter = (content.offsetTop + section.clientHeight) / 2;
      falloffDistance = (section.clientHeight - content.offsetTop) * FOCUS.falloff;
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
        start: 'top top',
        end: () => `+=${window.innerHeight * length}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          updateFocus();
        },
      },
    });

    // Amène le bas du contenu en bas de la section.
    timeline.to(
      content,
      {
        y: () => -Math.max(0, content.offsetTop + content.offsetHeight - section.clientHeight),
        duration: 1,
      },
      0,
    );

    return timeline;
  });
}

type HorizontalScrollOptions = {
  /** Rangée d'éléments, plus large que la section, qui glisse vers la gauche. */
  track: HTMLElement;
};

/**
 * Épingle la section et transforme le scroll vertical en défilement horizontal de la piste,
 * à vitesse égale : le premier élément est centré à l'écran au début, le dernier à la fin.
 * Un élément de la piste qui reçoit le focus clavier est ramené au centre de l'écran.
 *
 * Retourne le tween horizontal, à passer en `containerAnimation` aux animations des éléments.
 */
export function pinHorizontalScroll(section: HTMLElement, { track }: HorizontalScrollOptions) {
  return withPinnedLayout(section, (onRevert) => {
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

    const tween = gsap.fromTo(
      track,
      { x: () => section.clientWidth / 2 - getFirstCenter() },
      {
        x: () => section.clientWidth / 2 - getLastCenter(),
        ease: EASE.none,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
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
  /** Média qui grandit depuis le centre jusqu'à remplir la section. */
  media: HTMLElement;
  /** Légende qui apparaît une fois le média plein écran. */
  caption: HTMLElement;
  /**
   * Appelée quand le média commence à grandir (true), puis quand la section a quitté l'écran
   * ou qu'on remonte avant le début de l'agrandissement (false) : ex. lecture d'une vidéo.
   */
  onMediaVisibilityChange?: (visible: boolean) => void;
  /** Durée de l'épinglage, en hauteurs d'écran de scroll. */
  length?: number;
};

/**
 * Épingle la section : le média, invisible au départ, grandit au rythme du scroll jusqu'à remplir
 * l'écran ; la légende monte alors en fondu, avant une courte pause plein écran.
 */
export function pinExpandingMedia(section: HTMLElement, options: ExpandingMediaOptions) {
  const { media, caption, onMediaVisibilityChange, length = PIN_LENGTH.base } = options;

  return withPinnedLayout(section, (onRevert) => {
    const timeline = gsap
      .timeline({
        defaults: { ease: EASE.none },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * length}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(media, { scale: 0 }, { scale: 1, duration: EXPAND.grow }, 0)
      .fromTo(
        caption,
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, duration: EXPAND.caption, ease: EASE.out },
        EXPAND.captionAt,
      )
      // Pause finale, média plein écran, avant la fin de l'épinglage.
      .set({}, {}, 1);

    if (onMediaVisibilityChange) {
      // L'enveloppe d'épinglage (pin-spacer) couvre l'agrandissement puis la sortie de la section.
      ScrollTrigger.create({
        trigger: section.parentElement,
        start: 'top top',
        end: 'bottom top',
        onToggle: (self) => onMediaVisibilityChange(self.isActive),
      });
      onRevert(() => onMediaVisibilityChange(false));
    }

    return timeline;
  });
}
