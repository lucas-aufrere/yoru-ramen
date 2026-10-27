'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import {
  matchMotion,
  pinWithScrollingContent,
  playSequence,
  revealFadeUp,
  type SeekablePlayer,
} from '@/animations';
import { ImageSequence } from '@/components/media/ImageSequence';
import { Picture } from '@/components/media/Picture';
import { images } from '@/content/images';
import { sequences } from '@/content/sequences';
import { texts } from '@/content/texts';

import styles from './Ingredients.module.scss';

export function Ingredients() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<SeekablePlayer>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          const section = sectionRef.current;
          const content = contentRef.current;
          const sequence = sequenceRef.current;
          if (!section || !content || !sequence) return;

          revealFadeUp('[data-anim="intro"]');

          // Section figée sur un écran : la séquence avance pendant que seul le texte défile.
          pinWithScrollingContent(section, {
            content,
            focusItems: '[data-anim="ingredient"]',
          }).add(playSequence(sequence), 0);
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.ingredients} aria-labelledby="ingredients-title">
      <div className={styles.background}>
        <Picture
          image={images.ingredients.background}
          sizes="100vw"
          className={styles.backgroundImage}
          fill
        />
      </div>

      <div ref={contentRef} className={styles.content}>
        <div className={styles.intro}>
          <p className={styles.eyebrow} data-anim="intro">
            <span className={styles.index} aria-hidden="true">
              {texts.ingredients.index}
            </span>{' '}
            {texts.ingredients.eyebrow}
          </p>
          <h2 id="ingredients-title" className={styles.title} data-anim="intro">
            {texts.ingredients.title}
          </h2>
        </div>

        <ol className={styles.list} role="list">
          {texts.ingredients.items.map((item, index) => (
            <li key={item.title} className={styles.item} data-anim="ingredient">
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.track}>
        <div className={styles.stage}>
          <ImageSequence
            ref={sequenceRef}
            sequence={sequences.ingredients.ramen}
            className={styles.sequence}
          />
        </div>
      </div>
    </section>
  );
}
