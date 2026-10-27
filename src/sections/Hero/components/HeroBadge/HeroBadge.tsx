import { Fragment, useId } from 'react';

import { texts } from '@/content/texts';

import styles from './HeroBadge.module.scss';

// Cercle de rayon 38 dans un viewBox de 100 : le texte en fait le tour complet.
const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CIRCLE_PATH = `M 50,${50 - RADIUS} a ${RADIUS},${RADIUS} 0 1,1 0,${RADIUS * 2} a ${RADIUS},${RADIUS} 0 1,1 0,-${RADIUS * 2}`;

/**
 * Sceau décoratif : nom du restaurant écrit en cercle autour d'un idéogramme.
 * Masqué aux lecteurs d'écran, le même texte étant déjà présent dans la page.
 */
export function HeroBadge() {
  const pathId = useId();

  return (
    <svg className={styles.badge} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g className={styles.ring} data-anim="badge">
        <path id={pathId} d={CIRCLE_PATH} fill="none" />
        <text className={styles.ringText} textLength={CIRCUMFERENCE} lengthAdjust="spacing">
          <textPath href={`#${pathId}`}>
            {texts.hero.badge.ring.map((label) => (
              <Fragment key={label}>
                {label}
                <tspan className={styles.separator}> • </tspan>
              </Fragment>
            ))}
          </textPath>
        </text>
      </g>
      <text className={styles.center} x="50" y="50">
        {texts.global.glyph}
      </text>
    </svg>
  );
}
