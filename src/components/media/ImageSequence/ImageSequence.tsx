'use client';

import Image from 'next/image';
import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from 'react';

import { BREAKPOINT_QUERY, type SeekablePlayer } from '@/animations';
import type { SiteImageSequence } from '@/content/sequences';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { findNearestIndex, getFrameLoadOrder } from '@/lib/imageSequence';

import styles from './ImageSequence.module.scss';

// Téléchargement lancé une hauteur d'écran avant que la séquence n'entre dans le viewport.
const LOAD_MARGIN = '100% 0px';

// Une image sur 8 est chargée en premier : un scroll rapide trouve toujours une image proche.
const COARSE_LOAD_STEP = 8;

type ImageSequenceProps = {
  sequence: SiteImageSequence;
  className?: string;
  ref?: Ref<SeekablePlayer>;
};

/**
 * Séquence d'images dessinée dans un canvas, pilotée de l'extérieur via `seek()` (ex. au scroll).
 * La première image sert de repli : elle s'affiche sans JS, pendant le chargement et en mouvement
 * réduit. Les autres images ne sont téléchargées qu'à l'approche de la séquence, et jamais en
 * mouvement réduit. Sur petit écran, la variante `compact` est utilisée si elle existe.
 */
export function ImageSequence({ sequence, className, ref }: ImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Images décodées, indexées par numéro d'image : une case vide n'est pas encore prête.
  const framesRef = useRef<HTMLImageElement[]>([]);
  // Nombre d'images de la variante chargée (complète ou compacte), connu une fois le choix fait.
  const frameCountRef = useRef(sequence.frames.length);
  const targetIndexRef = useRef(0);
  const drawnIndexRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Dessine l'image prête la plus proche de celle demandée, seulement si elle change.
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    const index = findNearestIndex(frameCountRef.current, targetIndexRef.current, (i) =>
      Boolean(frames[i]),
    );
    if (!canvas || index === null || index === drawnIndexRef.current) return;

    canvas.getContext('2d')?.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
    drawnIndexRef.current = index;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      seek(progress) {
        targetIndexRef.current = Math.round(progress * (frameCountRef.current - 1));
        render();
      },
    }),
    [render],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const isSmallScreen = !window.matchMedia(BREAKPOINT_QUERY.md).matches;
    const variant = isSmallScreen && sequence.compact ? sequence.compact : sequence;
    let cancelled = false;

    frameCountRef.current = variant.frames.length;
    canvas.width = variant.width;
    canvas.height = variant.height;

    const loadFrames = () => {
      for (const index of getFrameLoadOrder(variant.frames.length, COARSE_LOAD_STEP)) {
        const image = document.createElement('img');
        image.src = variant.frames[index];
        // decode() évite un décodage synchrone, source de saccades, au moment du dessin.
        image
          .decode()
          .then(() => {
            if (cancelled) return;
            framesRef.current[index] = image;
            render();
          })
          .catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadFrames();
      },
      { rootMargin: LOAD_MARGIN },
    );

    observer.observe(canvas);

    return () => {
      cancelled = true;
      observer.disconnect();
      framesRef.current = [];
      drawnIndexRef.current = null;
    };
  }, [prefersReducedMotion, render, sequence]);

  return (
    <div
      className={[styles.sequence, className].filter(Boolean).join(' ')}
      style={{ aspectRatio: `${sequence.width} / ${sequence.height}` }}
    >
      {/* Non optimisée : même fichier que la première image du canvas, téléchargé une seule fois. */}
      <Image
        src={sequence.frames[0]}
        alt={sequence.description}
        width={sequence.width}
        height={sequence.height}
        className={styles.layer}
        unoptimized
      />
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className={styles.layer}
          width={sequence.width}
          height={sequence.height}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
