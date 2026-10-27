import styles from './Tag.module.scss';

type TagProps = {
  children: string;
};

/**
 * Étiquette en forme de pilule (mot-clé, caractéristique).
 */
export function Tag({ children }: TagProps) {
  return <span className={styles.tag}>{children}</span>;
}
