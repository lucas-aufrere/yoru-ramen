'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import {
  driftAcrossViewport,
  fadeOutOnScroll,
  matchMotion,
  pinHorizontalScroll,
  revealFadeUp,
} from '@/animations';
import { Picture } from '@/components/media/Picture';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { images } from '@/content/images';
import { anchors } from '@/content/navigation';
import { texts } from '@/content/texts';

import styles from './Ramens.module.scss';

export function Ramens() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          const section = sectionRef.current;
          const track = trackRef.current;
          if (!section || !track) return;

          revealFadeUp('[data-anim="intro"]');

          // Scroll vertical converti en défilement horizontal ; chaque plat glisse en le traversant.
          const containerAnimation = pinHorizontalScroll(section, { track });
          // Le plat glisse et grossit, le bol tourne, le nom en fond glisse en sens inverse.
          driftAcrossViewport('[data-anim="dish"]', {
            containerAnimation,
            mover: '[data-anim="plate"]',
            spinner: '[data-anim="bowl"]',
            counter: '[data-anim="backdrop"]',
          });
          fadeOutOnScroll('[data-anim="scroll-hint"]', { trigger: section });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={anchors.ramens}
      className={styles.ramens}
      aria-labelledby="ramens-title"
      data-header-theme="accent"
    >
      <header className={styles.header}>
        <div>
          {/* Surtitre décoratif : il répète le titre, lu une seule fois par les lecteurs d'écran. */}
          <p className={styles.eyebrow} aria-hidden="true" data-anim="intro">
            {texts.ramens.index} {texts.ramens.title}
          </p>
          <h2 id="ramens-title" className={styles.title} data-anim="intro">
            {texts.ramens.title}
          </h2>
        </div>
        <p className={styles.tagline} data-anim="intro">
          {texts.ramens.tagline.map((line) => (
            <span key={line} className={styles.taglineLine}>
              {line}
            </span>
          ))}
        </p>
      </header>

      <ul ref={trackRef} className={styles.track} role="list">
        {texts.ramens.dishes.map((dish) => (
          <li key={dish.id} className={styles.dish} data-anim="dish">
            {/* Nom géant décoratif : le titre lisible est repris dans la légende. */}
            <span className={styles.backdrop} aria-hidden="true" data-anim="backdrop">
              {dish.name}
            </span>

            <div className={styles.plate} data-anim="plate">
              <div data-anim="bowl">
                <Picture
                  image={images.ramens[dish.id]}
                  sizes="(min-width: 1440px) 484px, calc(20.7vw + 187px)"
                  className={styles.image}
                />
              </div>
              <h3 className={styles.dishTitle}>{dish.name}</h3>
              <p className={styles.description}>{dish.description}</p>
              <ButtonLink
                href={`#${anchors.menu}`}
                ariaLabel={`${texts.ramens.dishCta} ${dish.name}`}
                variant="dark"
                size="small"
              >
                {texts.ramens.dishCta}
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>

      <svg
        className={styles.scrollHint}
        viewBox="0 0 16 64"
        aria-hidden="true"
        focusable="false"
        data-anim="scroll-hint"
      >
        <path d="M8 0v62m-6-6 6 6 6-6" />
      </svg>
    </section>
  );
}
