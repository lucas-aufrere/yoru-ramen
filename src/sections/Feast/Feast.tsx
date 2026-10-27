'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { matchMotion, parallaxShiftY } from '@/animations';
import { Picture } from '@/components/media/Picture';
import { images } from '@/content/images';

import styles from './Feast.module.scss';

// Course de l'image, en % de sa hauteur : ±8 % d'une image haute de 120 % du cadre, soit ±9,6 %
// du cadre, dans la limite des 10 % de débord prévus en CSS ($size-parallax-bleed).
const PARALLAX_SHIFT = 16;

/**
 * Bandeau photo pleine largeur entre deux sections, sans texte : une <figure> plutôt qu'une
 * <section>, faute de titre à annoncer. L'image défile un peu plus lentement que la page.
 */
export function Feast() {
  const figureRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          parallaxShiftY('[data-anim="media"]', {
            trigger: figureRef.current,
            shift: PARALLAX_SHIFT,
          });
        },
      });
    },
    { scope: figureRef },
  );

  return (
    <figure ref={figureRef} className={styles.feast} data-header-theme="accent">
      <div className={styles.media} data-anim="media">
        <Picture image={images.feast.spread} sizes="100vw" className={styles.image} fill />
      </div>
    </figure>
  );
}
