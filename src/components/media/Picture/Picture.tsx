import Image from 'next/image';

import type { SiteImage } from '@/content/images';

type PictureProps = {
  image: SiteImage;
  /** Largeur d'affichage selon le viewport : détermine la taille d'image téléchargée. */
  sizes: string;
  className?: string;
  /** Image LCP uniquement (hero) : chargée en priorité. */
  priority?: boolean;
  /** Remplit son parent (positionné) au lieu de garder ses dimensions : image de fond. */
  fill?: boolean;
};

/**
 * Image optimisée par Next.js (formats modernes, dimensions réservées, chargement différé).
 */
export function Picture({ image, sizes, className, priority = false, fill = false }: PictureProps) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      sizes={sizes}
      className={className}
      priority={priority}
      fill={fill}
    />
  );
}
