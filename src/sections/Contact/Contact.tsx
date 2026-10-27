'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { matchMotion, POINTER_QUERY, revealFadeUp, tiltOnPointer } from '@/animations';
import { Icon, type IconName } from '@/components/ui/Icon';
import { anchors, navigation, type NavLink } from '@/content/navigation';
import { site } from '@/content/site';
import { texts } from '@/content/texts';
import { formatAddress, getDirectionsUrl } from '@/lib/address';

import styles from './Contact.module.scss';

type Action = {
  link: NavLink;
  description: string;
  icon: IconName;
};

const ACTIONS: Action[] = [
  {
    link: navigation.clickAndCollect,
    description: texts.contact.actions.clickAndCollect,
    icon: 'bag',
  },
  { link: navigation.delivery, description: texts.contact.actions.delivery, icon: 'scooter' },
  { link: navigation.booking, description: texts.contact.actions.booking, icon: 'calendar' },
];

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      matchMotion({
        full: () => {
          revealFadeUp('[data-anim="title"]');
          revealFadeUp('[data-anim="action"]', { y: 60 });
          revealFadeUp('[data-anim="info"]');
        },
      });
      // Inclinaison au survol : uniquement avec une souris ou un trackpad.
      matchMotion({ full: () => tiltOnPointer('[data-anim="action-card"]') }, POINTER_QUERY.fine);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={anchors.contact}
      className={styles.contact}
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title" className={styles.title} data-anim="title">
        {texts.contact.title}
      </h2>

      <ul className={styles.actions} role="list">
        {ACTIONS.map(({ link, description, icon }) => (
          <li key={link.label} data-anim="action">
            <a href={link.href} className={styles.action} data-anim="action-card">
              <span className={styles.actionIcons}>
                <Icon name={icon} />
                <Icon name="arrowUpRight" className={styles.arrow} />
              </span>
              <span>
                <h3 className={styles.actionTitle}>{link.label}</h3>
                <span className={styles.actionDescription}>{description}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <address className={styles.info} data-anim="info">
        <p className={styles.infoItem}>
          <Icon name="pin" />
          {formatAddress(site.address)}
          <a href={getDirectionsUrl(site.address)} className={styles.directions}>
            {texts.contact.directions}
            <span className={styles.visuallyHidden}> {texts.contact.directionsHint}</span>
          </a>
        </p>
        <a href={`tel:${site.phone.international}`} className={styles.infoItem}>
          <Icon name="phone" />
          {site.phone.display}
        </a>
        <a href={`mailto:${site.email}`} className={styles.infoItem}>
          <Icon name="mail" />
          {site.email}
        </a>
      </address>

      <p className={styles.signature} data-anim="info">
        {texts.contact.signature}
      </p>
    </section>
  );
}
