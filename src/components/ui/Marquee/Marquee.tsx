'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { marqueeOnScroll, matchMotion } from '@/animations';
import { Seal } from '@/components/ui/Seal';

import styles from './Marquee.module.scss';

// Nombre de copies de la liste : la piste reste plus large que l'écran pendant tout le défilement.
const COPIES = 3;

type MarqueeProps = {
  items: readonly string[];
  /** `accent` : fond rouge, grand texte, pastilles. `light` : fond blanc, texte plus petit, points rouges. */
  variant?: 'accent' | 'light';
  /** Défile vers la droite au lieu de la gauche. */
  reverse?: boolean;
  className?: string;
};

/**
 * Bandeau de mots qui défile horizontalement au rythme du scroll.
 * Seule la première copie de la liste est exposée aux technologies d'assistance.
 */
export function Marquee({ items, variant = 'accent', reverse = false, className }: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          marqueeOnScroll('[data-anim="marquee-track"]', {
            trigger: marqueeRef.current,
            reverse,
          });
        },
      });
    },
    { scope: marqueeRef },
  );

  const separator =
    variant === 'accent' ? <Seal /> : <span className={styles.dot} aria-hidden="true" />;

  return (
    <div
      ref={marqueeRef}
      className={[styles.marquee, styles[variant], className].filter(Boolean).join(' ')}
    >
      <div className={styles.track} data-anim="marquee-track">
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul key={copy} className={styles.list} role="list" aria-hidden={copy > 0 || undefined}>
            {items.map((item) => (
              <li key={item} className={styles.item}>
                {item}
                {separator}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
