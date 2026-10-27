'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { matchMotion, revealFadeUp, rotateOnScroll } from '@/animations';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Seal } from '@/components/ui/Seal';
import { site } from '@/content/site';
import { texts } from '@/content/texts';

import styles from './Socials.module.scss';

export function Socials() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          revealFadeUp('[data-anim="intro"]');
          // La pastille tourne pendant toute la traversée de la section.
          rotateOnScroll('[data-anim="seal"]', {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.socials}
      aria-labelledby="socials-title"
      data-header-theme="accent"
    >
      <div className={styles.content}>
        <p className={styles.eyebrow} data-anim="intro">
          {texts.socials.eyebrow}
        </p>
        <h2 id="socials-title" className={styles.title} data-anim="intro">
          {texts.socials.title}
        </h2>
        <p className={styles.paragraph} data-anim="intro">
          {texts.socials.paragraph}
        </p>
        <ul className={styles.links} role="list" data-anim="intro">
          {site.socials.map((social, index) => (
            <li key={social.name}>
              <ButtonLink
                href={social.href}
                variant={index === 0 ? 'dark' : 'outline'}
                withArrow={index === 0}
              >
                {social.name}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.seal} data-anim="seal">
        <Seal />
      </div>
    </section>
  );
}
