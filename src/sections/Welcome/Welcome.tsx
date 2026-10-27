'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { matchMotion, revealFadeUp, splitWordsColorReveal } from '@/animations';
import { Marquee } from '@/components/ui/Marquee';
import { Tag } from '@/components/ui/Tag';
import { anchors } from '@/content/navigation';
import { texts } from '@/content/texts';

import styles from './Welcome.module.scss';

export function Welcome() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          revealFadeUp('[data-anim="title"]');
          splitWordsColorReveal('[data-anim="statement"]');
          revealFadeUp('[data-anim="details"]');
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.welcome} aria-labelledby="welcome-title">
      {/* Bandeaux croisés, remontés à cheval sur le bas du hero. */}
      <div className={styles.ribbons}>
        <Marquee
          items={texts.welcome.ribbons.secondary}
          variant="light"
          reverse
          className={`${styles.ribbon} ${styles.ribbonBack}`}
        />
        <Marquee
          items={texts.welcome.ribbons.primary}
          className={`${styles.ribbon} ${styles.ribbonFront}`}
        />
      </div>

      <div className={styles.content}>
        <h2 id="welcome-title" className={styles.title} data-anim="title">
          <span aria-hidden="true">{texts.welcome.index}</span> {texts.welcome.title}
        </h2>

        <p className={styles.statement} data-anim="statement">
          {texts.welcome.statement.map((segment) =>
            'accent' in segment ? <em key={segment.text}>{segment.text}</em> : segment.text,
          )}
        </p>

        <div className={styles.details}>
          <a
            href={`#${anchors.menu}`}
            className={styles.discover}
            aria-label={texts.welcome.discoverLabel}
            data-anim="details"
          >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 4v15m-6-6 6 6 6-6" />
            </svg>
          </a>

          <p className={styles.paragraph} data-anim="details">
            {texts.welcome.paragraph}
          </p>

          <ul className={styles.tags} role="list" data-anim="details">
            {texts.welcome.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
