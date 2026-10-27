'use client';

import { useEffect, useState } from 'react';

export type HeaderTheme = 'default' | 'accent' | 'light';

// Ligne observée : une fine bande à la hauteur du logo, pour que le thème change au moment
// précis où une section passe sous le header (et non dès qu'elle effleure le haut de l'écran).
const HEADER_BAND = '-5% 0px -94% 0px';

/**
 * Thème de la section qui passe sous le header fixe, déclaré par l'attribut
 * `data-header-theme` des sections (`accent` : fond vermillon, `light` : fond blanc).
 * `default` ailleurs.
 */
export function useHeaderTheme() {
  const [theme, setTheme] = useState<HeaderTheme>('default');

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-header-theme]');
    const underHeader = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) underHeader.add(section);
          else underHeader.delete(section);
        }

        const [current] = underHeader;
        setTheme((current?.dataset.headerTheme as HeaderTheme | undefined) ?? 'default');
      },
      { rootMargin: HEADER_BAND },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return theme;
}
