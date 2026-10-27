import { texts } from '@/content/texts';

import styles from './SkipLink.module.scss';

type SkipLinkProps = {
  targetId: string;
};

/**
 * Lien d'évitement, visible uniquement au focus clavier.
 */
export function SkipLink({ targetId }: SkipLinkProps) {
  return (
    <a href={`#${targetId}`} className={styles.skipLink}>
      {texts.global.skipLink}
    </a>
  );
}
