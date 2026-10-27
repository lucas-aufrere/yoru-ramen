export type MenuItem = {
  name: string;
  description: string;
  /** Prix en euros, formaté à l'affichage avec Intl.NumberFormat. */
  price: number;
  /**
   * Informations de sécurité alimentaire, fournies par le restaurant et jamais devinées :
   * absentes tant qu'elles ne sont pas connues (et alors non affichées).
   */
  allergens?: string[];
  vegetarian?: boolean;
};

export type MenuCategory = {
  /** Identifiant stable, utilisé dans les id HTML des onglets. */
  id: string;
  name: string;
  items: MenuItem[];
};

// PROVISOIRE : plats, descriptions et prix d'exemple, à remplacer par la vraie carte.
export const menu: MenuCategory[] = [
  {
    id: 'ramens',
    name: 'Ramens',
    items: [
      {
        name: 'Tonkotsu',
        description: 'Bouillon de porc crémeux, porc pané croustillant, œuf ajitama, nori.',
        price: 14.5,
      },
      {
        name: 'Miso ramen',
        description: 'Bouillon miso, chashu, maïs doux, pousses de soja, œuf ajitama.',
        price: 14,
      },
      {
        name: 'Tantanmen',
        description: 'Bouillon pimenté au sésame, porc haché épicé, pak choï, œuf ajitama.',
        price: 15,
      },
      {
        name: 'Shio ramen',
        description: 'Bouillon de volaille clair au sel, poulet rôti, menma, œuf ajitama.',
        price: 13.5,
      },
    ],
  },
  {
    id: 'gyozas',
    name: 'Gyozas',
    items: [
      {
        name: 'Gyozas porc',
        description: 'Cinq raviolis grillés puis vapeur, sauce soja vinaigrée.',
        price: 6.5,
      },
      {
        name: 'Gyozas poulet',
        description: 'Cinq raviolis au poulet et à la ciboule, sauce soja vinaigrée.',
        price: 6.5,
      },
      {
        name: 'Gyozas légumes',
        description: 'Cinq raviolis au chou, champignons et carotte, sauce soja vinaigrée.',
        price: 6,
      },
    ],
  },
  {
    id: 'karaage',
    name: 'Karaage',
    items: [
      {
        name: 'Karaage classique',
        description: 'Poulet mariné au gingembre et à la sauce soja, frit, citron.',
        price: 8,
      },
      {
        name: 'Karaage épicé',
        description: 'Le classique, relevé d’une sauce au piment et au sésame.',
        price: 8.5,
      },
      {
        name: 'Karaage mayo yuzu',
        description: 'Le classique, servi avec une mayonnaise japonaise au yuzu.',
        price: 9,
      },
    ],
  },
  {
    id: 'donburi',
    name: 'Donburi',
    items: [
      {
        name: 'Chashu don',
        description: 'Riz, chashu caramélisé, œuf ajitama, ciboule.',
        price: 12,
      },
      {
        name: 'Karaage don',
        description: 'Riz, karaage, chou croquant, mayonnaise japonaise.',
        price: 12,
      },
      {
        name: 'Gyudon',
        description: 'Riz, bœuf émincé mijoté aux oignons, gingembre mariné.',
        price: 13,
      },
    ],
  },
  {
    id: 'mochis',
    name: 'Mochis',
    items: [
      {
        name: 'Mochis glacés',
        description: 'Deux mochis au choix : matcha, sésame noir ou mangue.',
        price: 5,
      },
      {
        name: 'Dorayaki',
        description: 'Deux pancakes moelleux fourrés à la pâte de haricot rouge.',
        price: 4.5,
      },
    ],
  },
  {
    id: 'boissons',
    name: 'Boissons',
    items: [
      {
        name: 'Bière japonaise',
        description: 'Blonde pression, 33 cl.',
        price: 6,
      },
      {
        name: 'Thé vert glacé',
        description: 'Infusé maison, peu sucré, 40 cl.',
        price: 4,
      },
      {
        name: 'Ramune',
        description: 'La limonade japonaise à bille, 20 cl.',
        price: 4.5,
      },
      {
        name: 'Soda',
        description: 'Cola, cola zéro ou limonade, 33 cl.',
        price: 3.5,
      },
    ],
  },
];

export type Combo = {
  name: string;
  /** Composition de la formule, en une ligne. */
  contents: string;
  /** Prix en euros, formaté à l'affichage avec Intl.NumberFormat. */
  price: number;
  /** Niveau de faim, de 1 à 3 : nombre de pastilles affichées. */
  level: 1 | 2 | 3;
};

// PROVISOIRE : formules et prix d'exemple, à remplacer par la vraie offre.
export const combos: Combo[] = [
  { name: 'Petit creux', contents: '1 ramen + 1 boisson', price: 16.9, level: 1 },
  { name: 'Grosse faim', contents: '1 ramen + 1 side + 1 boisson', price: 21.9, level: 2 },
  {
    name: 'Faim de nuit',
    contents: '1 ramen + 2 sides + 1 boisson + 1 dessert',
    price: 27.9,
    level: 3,
  },
];
