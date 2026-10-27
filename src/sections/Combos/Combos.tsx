'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { matchMotion, revealCascade, revealFadeUp } from '@/animations';
import { Seal } from '@/components/ui/Seal';
import { combos } from '@/content/menu';
import { texts } from '@/content/texts';
import { formatPrice } from '@/lib/formatPrice';

import styles from './Combos.module.scss';

export function Combos() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          revealFadeUp('[data-anim="intro"]');
          // Les marches montent prendre leur place une à une, de la plus basse à la plus haute.
          revealCascade('[data-anim="combo"]');
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.combos}
      aria-labelledby="combos-title"
      data-header-theme="light"
    >
      <h2 id="combos-title" className={styles.title} data-anim="intro">
        {texts.combos.title}
      </h2>
      <p className={styles.intro} data-anim="intro">
        {texts.combos.intro}
      </p>

      {/* En escalier : chaque formule est une marche plus haute que la précédente. */}
      <ul className={styles.list} role="list">
        {combos.map((combo, index) => (
          <li key={combo.name} className={styles.combo} data-anim="combo">
            <div className={styles.seals}>
              {Array.from({ length: combo.level }, (_, seal) => (
                <Seal key={seal} tone={index % 2 === 0 ? 'accent' : 'dark'} />
              ))}
            </div>
            <div>
              <h3 className={styles.name}>{combo.name}</h3>
              <p className={styles.contents}>{combo.contents}</p>
              <p className={styles.price}>{formatPrice(combo.price)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
