'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { matchMotion, revealFadeUp } from '@/animations';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Seal } from '@/components/ui/Seal';
import { anchors, navigation } from '@/content/navigation';
import { site } from '@/content/site';
import { texts } from '@/content/texts';

import styles from './Footer.module.scss';

// Pictogramme de chaque réseau, par nom (site.socials).
const SOCIAL_ICONS: Record<string, IconName> = {
  Instagram: 'instagram',
  TikTok: 'tiktok',
};

const ORDER_LINKS = [navigation.clickAndCollect, navigation.delivery, navigation.booking];

/**
 * Pied de page : slogan géant, coordonnées, liens de commande, réseaux sociaux et copyright.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          revealFadeUp('[data-anim="slogan"]');
          revealFadeUp('[data-anim="column"]', { y: 24 });
        },
      });
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} className={styles.footer}>
      <p className={styles.slogan}>
        <span className={styles.sloganLine} data-anim="slogan">
          {texts.footer.slogan.first}
        </span>
        <span className={`${styles.sloganLine} ${styles.sloganAccent}`} data-anim="slogan">
          <Seal tone="accent" className={styles.seal} />
          {texts.footer.slogan.second}
        </span>
      </p>

      <div className={styles.columns}>
        <div data-anim="column">
          <h2 className={styles.label}>{texts.footer.columns.address}</h2>
          <address className={styles.text}>
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
        </div>

        <div data-anim="column">
          <h2 className={styles.label}>{texts.footer.columns.contact}</h2>
          <address className={styles.list}>
            <a href={`tel:${site.phone.international}`} className={styles.link}>
              {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className={styles.link}>
              {site.email}
            </a>
          </address>
        </div>

        <nav aria-labelledby="footer-order" data-anim="column">
          <h2 id="footer-order" className={styles.label}>
            {texts.footer.columns.order}
          </h2>
          <ul className={styles.list} role="list">
            {ORDER_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div data-anim="column">
          <h2 className={styles.label}>{texts.footer.columns.follow}</h2>
          <ul className={styles.socials} role="list">
            {site.socials.map((social) => (
              <li key={social.name}>
                <a href={social.href} className={styles.social} aria-label={social.name}>
                  <Icon name={SOCIAL_ICONS[social.name]} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          © {site.copyrightYear} {site.name} — {site.address.city}
        </p>
        <a href={`#${anchors.top}`} className={styles.backToTop}>
          {texts.footer.backToTop}
          <Icon name="arrowUp" />
        </a>
      </div>
    </footer>
  );
}
