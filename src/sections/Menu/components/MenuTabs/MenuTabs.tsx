'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { useGSAP } from '@gsap/react';

import { revealSwap } from '@/animations';
import type { MenuCategory } from '@/content/menu';
import { texts } from '@/content/texts';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatPrice } from '@/lib/formatPrice';

import styles from './MenuTabs.module.scss';

type MenuTabsProps = {
  categories: MenuCategory[];
};

// Onglet visé par une touche, selon le motif d'onglets WAI-ARIA (null : touche non gérée).
function getTargetIndex(key: string, index: number, count: number) {
  switch (key) {
    case 'ArrowDown':
    case 'ArrowRight':
      return (index + 1) % count;
    case 'ArrowUp':
    case 'ArrowLeft':
      return (index - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}

/**
 * Carte en onglets : les catégories d'un côté, les plats de la catégorie choisie de l'autre.
 * Motif d'onglets WAI-ARIA : les flèches, Début et Fin changent d'onglet, et seul l'onglet actif
 * est atteignable à la tabulation. Tous les panneaux restent dans le DOM (masqués) pour le SEO.
 */
export function MenuTabs({ categories }: MenuTabsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const prefersReducedMotion = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: rootRef });

  const select = contextSafe((index: number) => {
    if (index === activeIndex) return;

    setActiveIndex(index);
    if (!prefersReducedMotion) revealSwap(`[data-panel="${index}"] [data-anim="menu-item"]`);
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const target = getTargetIndex(event.key, index, categories.length);
    if (target === null) return;

    event.preventDefault();
    select(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <div ref={rootRef} className={styles.menuTabs}>
      <div
        role="tablist"
        aria-label={texts.menu.tabsLabel}
        aria-orientation="vertical"
        className={styles.tabList}
      >
        {categories.map((category, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={category.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${category.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${category.id}`}
              tabIndex={isActive ? 0 : -1}
              className={styles.tab}
              onClick={() => select(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              data-anim="menu-tab"
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {categories.map((category, index) => (
        <div
          key={category.id}
          role="tabpanel"
          id={`${baseId}-panel-${category.id}`}
          aria-labelledby={`${baseId}-tab-${category.id}`}
          tabIndex={0}
          hidden={index !== activeIndex}
          className={styles.panel}
          data-panel={index}
        >
          <ul className={styles.items} role="list">
            {category.items.map((item) => (
              <li key={item.name} className={styles.item} data-anim="menu-item">
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
