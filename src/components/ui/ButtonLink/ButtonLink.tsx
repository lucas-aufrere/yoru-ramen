import styles from './ButtonLink.module.scss';

type ButtonLinkProps = {
  href: string;
  children: string;
  /** Nom accessible plus précis que le texte visible, qu'il doit contenir (WCAG 2.5.3). */
  ariaLabel?: string;
  variant?: 'primary' | 'outline' | 'dark';
  size?: 'medium' | 'small';
  withArrow?: boolean;
  className?: string;
};

/**
 * Lien de navigation présenté comme un bouton (CTA).
 */
export function ButtonLink({
  href,
  children,
  ariaLabel,
  variant = 'primary',
  size = 'medium',
  withArrow = false,
  className,
}: ButtonLinkProps) {
  const classNames = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <a href={href} className={classNames} aria-label={ariaLabel}>
      {children}
      {withArrow && (
        <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 12h15m-6-6 6 6-6 6" />
        </svg>
      )}
    </a>
  );
}
