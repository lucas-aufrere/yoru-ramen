import type { StaticImageData } from 'next/image';

import drinks from '@/assets/images/categories/drinks.jpg';
import karaage from '@/assets/images/categories/karaage.jpg';
import ramensCategory from '@/assets/images/categories/ramens.jpg';
import feast from '@/assets/images/feast/feast.jpg';
import ingredientsBackground from '@/assets/images/ingredients/background.jpg';
import miso from '@/assets/images/ramens/miso.png';
import shio from '@/assets/images/ramens/shio.png';
import tantanmen from '@/assets/images/ramens/tantanmen.png';
import tonkotsu from '@/assets/images/ramens/tonkotsu.png';

export type SiteImage = {
  src: StaticImageData;
  alt: string;
};

export const images = {
  feast: {
    spread: {
      src: feast,
      alt: 'Festin japonais vu du dessus sur fond rouge : bol de ramen, gyozas, edamame, karaage et thé glacé.',
    },
  },
  ingredients: {
    // Décor d'ambiance sans information : ignoré par les lecteurs d'écran.
    background: { src: ingredientsBackground, alt: '' },
  },
  categories: {
    ramens: {
      src: ramensCategory,
      alt: 'Bol de ramen fumant avec chashu, œufs marinés, nori, ciboule et piment.',
    },
    karaage: {
      src: karaage,
      alt: 'Morceaux de poulet karaage dorés au sésame, servis avec une sauce à tremper.',
    },
    drinks: {
      src: drinks,
      alt: 'Une bière pression, un thé vert glacé et un soda sur glace, sur un comptoir humide.',
    },
  },
  ramens: {
    tonkotsu: {
      src: tonkotsu,
      alt: 'Bol de ramen tonkotsu au porc pané, œufs marinés, feuilles de nori, ciboule et pousses de soja.',
    },
    miso: {
      src: miso,
      alt: 'Bol de ramen miso avec chashu, maïs, pousses de soja, œufs marinés, ciboule et piment.',
    },
    shio: {
      src: shio,
      alt: 'Bol de ramen au bouillon de volaille clair, poulet rôti, menma, œufs marinés et ciboule.',
    },
    tantanmen: {
      src: tantanmen,
      alt: 'Bol de tantanmen au bouillon pimenté, porc haché épicé, pak choï, œufs marinés et ciboule.',
    },
  },
} satisfies Record<string, Record<string, SiteImage>>;
