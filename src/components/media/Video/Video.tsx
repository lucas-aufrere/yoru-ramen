'use client';

import { useEffect, useRef } from 'react';
import { preload } from 'react-dom';

import type { SiteVideo } from '@/content/videos';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import styles from './Video.module.scss';

type VideoProps = {
  video: SiteVideo;
  className?: string;
  /** Vidéo purement décorative : masquée aux technologies d'assistance. */
  decorative?: boolean;
  /** Précharge le poster en priorité (vidéo au-dessus de la ligne de flottaison). */
  priority?: boolean;
  /**
   * Lecture pilotée de l'extérieur (ex. par une animation) au lieu de la visibilité à l'écran.
   * Utile quand la vidéo est déjà « visible » sans l'être vraiment (ex. réduite à l'échelle 0).
   */
  playing?: boolean;
};

// Les navigateurs mobiles n'autorisent la lecture automatique que d'une vidéo muette. Or React ne
// pose pas toujours la propriété `muted` sur une vidéo rendue côté serveur (l'attribut seul ne
// suffit pas) : sans cela, la lecture est refusée à la première visite. Le navigateur peut aussi
// refuser la lecture (économie de données) : le poster reste alors affiché.
function play(element: HTMLVideoElement) {
  element.muted = true;
  element.defaultMuted = true;
  element.play().catch(() => {});
}

/**
 * Vidéo muette en boucle, lue uniquement quand elle est visible (ou quand `playing` le demande).
 * Avec `prefers-reduced-motion`, elle n'est jamais lancée et seul le poster s'affiche.
 */
export function Video({
  video,
  className,
  decorative = false,
  priority = false,
  playing,
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isControlled = playing !== undefined;

  if (priority) preload(video.poster, { as: 'image', fetchPriority: 'high' });

  // Lecture pilotée par la prop `playing`.
  useEffect(() => {
    const element = videoRef.current;
    if (!element || !isControlled || prefersReducedMotion) return;

    if (playing) play(element);
    else element.pause();
  }, [isControlled, playing, prefersReducedMotion]);

  // Lecture pilotée par la visibilité à l'écran.
  useEffect(() => {
    const element = videoRef.current;
    if (!element || isControlled || prefersReducedMotion) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play(element);
      else element.pause();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      element.pause();
    };
  }, [isControlled, prefersReducedMotion]);

  return (
    <video
      ref={videoRef}
      className={[styles.video, className].filter(Boolean).join(' ')}
      poster={video.poster}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : video.description}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      disableRemotePlayback
    >
      {video.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
