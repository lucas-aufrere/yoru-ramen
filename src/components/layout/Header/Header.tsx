'use client';

import { useId, useRef, useState } from 'react';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { anchors, navigation } from '@/content/navigation';
import { site } from '@/content/site';
import { texts } from '@/content/texts';
import { useHeaderTheme } from '@/hooks/useHeaderTheme';

import styles from './Header.module.scss';

/**
 * En-tête du site, fixe en haut de l'écran : logo, navigation (pilule sur desktop) et lien de
 * réservation. Ses couleurs s'adaptent à la section qui passe dessous (`data-header-theme`).
 * Sous le breakpoint lg, la navigation passe dans un <dialog> modal, qui gère nativement
 * le piège du focus, la fermeture à Échap et le retour du focus sur le bouton d'ouverture.
 */
export function Header() {
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useHeaderTheme();

  const openMenu = () => {
    menuRef.current?.showModal();
    setIsMenuOpen(true);
  };

  const closeMenu = () => menuRef.current?.close();

  return (
    <header className={styles.header} data-theme={theme}>
      <a href={`#${anchors.top}`} className={styles.logo} aria-label={texts.header.homeLabel}>
        {site.name}
      </a>

      <nav className={styles.nav} aria-label={texts.header.navLabel}>
        <ul className={styles.navList} role="list">
          {navigation.header.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <ButtonLink href={navigation.booking.href} size="small" className={styles.cta}>
        {navigation.booking.label}
      </ButtonLink>

      <button
        type="button"
        className={styles.menuToggle}
        aria-label={texts.header.openMenu}
        aria-expanded={isMenuOpen}
        aria-controls={menuId}
        onClick={openMenu}
      >
        <span className={styles.menuIcon} aria-hidden="true" />
      </button>

      <dialog
        ref={menuRef}
        id={menuId}
        className={styles.menu}
        aria-label={texts.header.navLabel}
        onClose={() => setIsMenuOpen(false)}
        data-lenis-prevent
      >
        <div className={styles.menuTop}>
          <span className={styles.logo} aria-hidden="true">
            {site.name}
          </span>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label={texts.header.closeMenu}
            onClick={closeMenu}
          >
            <span className={`${styles.menuIcon} ${styles.menuIconClose}`} aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.menuNav} aria-label={texts.header.navLabel}>
          <ul className={styles.menuList} role="list">
            {navigation.header.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.menuLink} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ButtonLink href={navigation.booking.href} withArrow className={styles.menuCta}>
          {navigation.booking.label}
        </ButtonLink>
      </dialog>
    </header>
  );
}
