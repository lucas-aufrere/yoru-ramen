'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { BREAKPOINT_QUERY, matchMotion, parallaxShiftY } from '@/animations';
import { Picture } from '@/components/media/Picture';
import { images } from '@/content/images';
import { anchors } from '@/content/navigation';
import { texts } from '@/content/texts';

import styles from './Categories.module.scss';

// Course verticale de chaque carte au scroll, en % de sa hauteur.
const CARD_SHIFT = 16;

export function Categories() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Cartes côte à côte uniquement : empilées sur mobile, elles se chevaucheraient.
      matchMotion(
        {
          full: () => {
            const trigger = sectionRef.current;
            parallaxShiftY('[data-anim="card-rise"]', { trigger, shift: -CARD_SHIFT });
            parallaxShiftY('[data-anim="card-sink"]', { trigger, shift: CARD_SHIFT });
          },
        },
        BREAKPOINT_QUERY.md,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.categories} aria-labelledby="categories-title">
      <h2 id="categories-title" className={styles.title}>
        {texts.categories.title}
      </h2>

      <ul className={styles.cards} role="list">
        {texts.categories.cards.map((card, index) => (
          // Une carte sur deux descend pendant que les autres montent : avec trois cartes,
          // celle du centre descend et les deux côtés remontent.
          <li
            key={card.id}
            className={styles.card}
            data-anim={index % 2 === 0 ? 'card-rise' : 'card-sink'}
          >
            <div className={styles.media}>
              <Picture
                image={images.categories[card.id]}
                sizes="(min-width: 768px) 33vw, 100vw"
                className={styles.image}
                fill
              />
            </div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <a href={`#${anchors[card.target]}`} className={styles.link}>
              {card.linkLabel}
              <svg
                className={styles.arrow}
                viewBox="0 0 104 12"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M0 6h102m-5-5 5 5-5 5" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
