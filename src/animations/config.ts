export const DURATION = { fast: 0.4, base: 0.8, slow: 1.4 } as const;
export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
  none: 'none',
} as const;
export const STAGGER = { tight: 0.05, base: 0.1, loose: 0.2 } as const;
export const DELAY = { short: 0.2, base: 0.5 } as const;
// Mise en avant au scroll : opacité des éléments en retrait, et distance (en part de la zone
// visible) à partir de laquelle un élément est entièrement en retrait.
export const FOCUS = { dimOpacity: 0.3, falloff: 0.3 } as const;
// Durée d'un épinglage, en hauteurs d'écran de scroll.
export const PIN_LENGTH = { base: 2, long: 2.5 } as const;
// Média épinglé qui s'agrandit : parts de la timeline (durée 1) consacrées à l'agrandissement,
// puis à l'apparition de la légende. Le reste est une pause, média plein écran.
export const EXPAND = { grow: 0.75, captionAt: 0.75, caption: 0.15 } as const;

export const MOTION_QUERY = {
  full: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

// Inclinaison 3D au survol : angle maximal (degrés) et perspective (px) de la scène.
export const TILT = { angle: 6, perspective: 1200 } as const;

// Mêmes seuils que $breakpoints (styles/abstracts/_breakpoints.scss), en rem comme breakpoint-up().
export const BREAKPOINT_QUERY = {
  md: '(min-width: 48rem)',
} as const;

// Appareils à vrai pointeur (souris, trackpad) : les effets de survol n'ont de sens que là.
export const POINTER_QUERY = {
  fine: '(hover: hover) and (pointer: fine)',
} as const;
