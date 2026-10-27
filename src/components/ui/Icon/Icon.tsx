import styles from './Icon.module.scss';

// Tracés au trait sur une grille de 24 : l'épaisseur et la couleur viennent du CSS.
const PATHS = {
  bag: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',
  scooter:
    'M3.5 17a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0m12 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M8.5 17h7M18 17 15 5h-3M4 12h6l2 5',
  calendar: 'M4 6h16v14H4zm0 5h16M8 3v5m8-5v5',
  arrowUpRight: 'M7 17 17 7M9 7h8v8',
  pin: 'M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11zm-2-11a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
  phone:
    'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  mail: 'M3 6h18v12H3zm0 0 9 7 9-7',
  arrowUp: 'M12 19V5m-6 6 6-6 6 6',
  instagram:
    'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 9a4 4 0 1 0 8 0 4 4 0 1 0-8 0m9.5-5.5h.01',
  tiktok: 'M14 3v12a4 4 0 1 1-4-4m4-8c.5 2.8 2.6 4.8 5.5 5',
} as const;

export type IconName = keyof typeof PATHS;

type IconProps = {
  name: IconName;
  className?: string;
};

/**
 * Pictogramme décoratif : le sens est toujours porté par le texte qui l'accompagne.
 */
export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={[styles.icon, className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
