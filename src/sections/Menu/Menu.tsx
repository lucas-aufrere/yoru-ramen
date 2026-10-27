'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { matchMotion, revealFadeUp } from '@/animations';
import { menu } from '@/content/menu';
import { anchors } from '@/content/navigation';
import { texts } from '@/content/texts';

import { MenuTabs } from './components/MenuTabs';
import styles from './Menu.module.scss';

export function Menu() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          revealFadeUp('[data-anim="intro"]');
          revealFadeUp('[data-anim="menu-tab"]', { y: 24 });
          // Seuls les plats de l'onglet affiché : les autres apparaîtront au changement d'onglet.
          revealFadeUp('[data-panel]:not([hidden]) [data-anim="menu-item"]', { y: 24 });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={anchors.menu}
      className={styles.menu}
      aria-labelledby="menu-title"
    >
      <p className={styles.eyebrow} data-anim="intro">
        <span className={styles.index} aria-hidden="true">
          {texts.menu.index}
        </span>{' '}
        {texts.menu.eyebrow}
      </p>
      <h2 id="menu-title" className={styles.title} data-anim="intro">
        {texts.menu.title}
      </h2>

      <MenuTabs categories={menu} />
    </section>
  );
}
