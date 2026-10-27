'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import {
  matchMotion,
  parallaxScrollOut,
  revealFadeUp,
  rotateOnScroll,
  splitCharsReveal,
} from '@/animations';
import { DELAY } from '@/animations/config';
import { Video } from '@/components/media/Video';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { anchors, navigation } from '@/content/navigation';
import { texts } from '@/content/texts';
import { videos } from '@/content/videos';

import { HeroBadge } from './components/HeroBadge';
import styles from './Hero.module.scss';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          const section = sectionRef.current;

          revealFadeUp('[data-anim="eyebrow"]', { scroll: false, y: 20 });
          splitCharsReveal('[data-anim="title"]', { delay: DELAY.short });
          revealFadeUp('[data-anim="intro"]', { scroll: false, y: 24, delay: DELAY.base });
          rotateOnScroll('[data-anim="badge"]', { trigger: section });

          // En quittant le hero : la vidéo descend et zoome, le texte remonte et s'efface.
          parallaxScrollOut('[data-anim="media"]', { trigger: section, yPercent: 20, scale: 1.1 });
          parallaxScrollOut('[data-anim="content"]', {
            trigger: section,
            yPercent: -15,
            fade: true,
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section id={anchors.top} ref={sectionRef} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} data-anim="media">
        <Video video={videos.hero.ramen} className={styles.video} decorative priority />
      </div>
      <div className={styles.veil} aria-hidden="true" />

      <div className={styles.content} data-anim="content">
        <p className={styles.eyebrow} data-anim="eyebrow">
          <span className={styles.dot} aria-hidden="true" />
          {texts.hero.eyebrow}
        </p>

        <h1 id="hero-title" className={styles.title} data-anim="title">
          <span className={styles.titleLine}>{texts.hero.title.first}</span>{' '}
          <span className={`${styles.titleLine} ${styles.titleAccent}`}>
            {texts.hero.title.second}
          </span>
        </h1>

        <p className={styles.lead} data-anim="intro">
          {texts.hero.lead}
        </p>

        <div className={styles.actions} data-anim="intro">
          <ButtonLink href={navigation.booking.href} withArrow>
            {navigation.booking.label}
          </ButtonLink>
          <ButtonLink href={`#${anchors.menu}`} variant="outline">
            {texts.hero.secondaryCta}
          </ButtonLink>
        </div>

        <p className={styles.scrollHint} data-anim="intro" aria-hidden="true">
          {texts.hero.scrollHint}
        </p>
      </div>

      <div className={styles.badge}>
        <HeroBadge />
      </div>
    </section>
  );
}
