import { texts } from '@/content/texts';

import styles from './Seal.module.scss';

type SealProps = {
  /** `dark` : pastille noire (sur fond vermillon). `accent` : pastille vermillon (sur fond noir). */
  tone?: 'dark' | 'accent';
  className?: string;
};

/**
 * Pastille ronde portant l'idéogramme du restaurant, purement décorative.
 * Sa taille suit celle du texte de son parent.
 */
export function Seal({ tone = 'dark', className }: SealProps) {
  return (
    <span
      className={[styles.seal, styles[tone], className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className={styles.glyph}>{texts.global.glyph}</span>
    </span>
  );
}
