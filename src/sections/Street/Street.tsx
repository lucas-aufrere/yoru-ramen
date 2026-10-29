'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';

import { matchMotion, pinExpandingMedia } from '@/animations';
import { Video } from '@/components/media/Video';
import { texts } from '@/content/texts';
import { videos } from '@/content/videos';

import styles from './Street.module.scss';

export function Street() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  // Lecture lancée par l'animation : à l'échelle 0, la vidéo compterait déjà comme visible.
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          const section = sectionRef.current;
          const media = mediaRef.current;
          const caption = captionRef.current;
          if (!section || !media || !caption) return;

          // La vidéo grandit sous le titre japonais ; la légende française apparaît à la fin.
          pinExpandingMedia(section, {
            media,
            caption,
            onMediaVisibilityChange: setIsVideoPlaying,
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.street} aria-labelledby="street-title">
      <div ref={mediaRef} className={styles.media}>
        <Video video={videos.street.osaka} decorative playing={isVideoPlaying} />
      </div>

      <div className={styles.content}>
        <h2 id="street-title" className={styles.title}>
          <span lang="ja">{texts.street.japanese}</span>
          <span className={styles.visuallyHidden}> ({texts.street.translation})</span>
        </h2>
        <p ref={captionRef} className={styles.caption}>
          {texts.street.caption}
        </p>
      </div>
    </section>
  );
}
