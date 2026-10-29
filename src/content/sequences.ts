type ImageSequenceFrames = {
  /** Chemins des images, dans l'ordre de lecture. */
  frames: string[];
  /** Dimensions communes à toutes les images, en pixels. */
  width: number;
  height: number;
};

export type SiteImageSequence = ImageSequenceFrames & {
  /**
   * Variante légère pour les petits écrans (moins d'images, plus petites) : décodées, toutes les
   * images de la séquence complète saturent la mémoire d'un téléphone et font saccader le scroll.
   */
  compact?: ImageSequenceFrames;
  description: string;
};

/** Liste les images `frame-001.jpg`, `frame-002.jpg`… d'un dossier de `public/`. */
function listFrames(folder: string, count: number) {
  return Array.from(
    { length: count },
    (_, index) => `${folder}/frame-${String(index + 1).padStart(3, '0')}.jpg`,
  );
}

export const sequences = {
  ingredients: {
    ramen: {
      frames: listFrames('/sequences/ramen', 121),
      width: 940,
      height: 940,
      // Une image sur deux, en 600 px.
      compact: { frames: listFrames('/sequences/ramen/mobile', 61), width: 600, height: 600 },
      description:
        'Bouillon tonkotsu versé dans un bol de ramen garni de nouilles, chashu, œufs marinés, ciboule et piment.',
    },
  },
} satisfies Record<string, Record<string, SiteImageSequence>>;
