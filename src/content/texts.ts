// Textes organisés par section, dans le même ordre que la page.

/** Segment d'un texte riche : `accent` le met en valeur (italique, couleur d'accent). */
export type TextSegment = {
  text: string;
  accent?: boolean;
};

export const texts = {
  global: {
    skipLink: 'Aller au contenu',
    // Idéogramme « nuit » (yoru), signature visuelle du restaurant.
    glyph: '夜',
  },
  header: {
    homeLabel: 'Yoru Osaka, retour en haut de page',
    navLabel: 'Navigation principale',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  hero: {
    eyebrow: 'Ramen bar — Esprit Osaka',
    title: { first: 'Yoru', second: 'Osaka' },
    lead: 'Des bouillons mijotés pendant des heures, des nouilles fraîches et des toppings généreux. L’âme des ruelles nocturnes d’Osaka, servie dans un bol.',
    secondaryCta: 'Voir la carte',
    scrollHint: 'Scroll pour découvrir +',
    badge: { ring: ['Yoru Osaka', 'Ramen bar'] },
  },
  welcome: {
    ribbons: {
      primary: ['Ramen', 'Gyozas', 'Karaage', 'Donburi', 'Mochis'],
      secondary: ['Sur place', 'À emporter', 'Nouilles fraîches', 'Bouillons maison'],
    },
    index: '(01)',
    title: 'Bienvenue chez Yoru Osaka',
    statement: [
      { text: 'Bouillons ' },
      { text: 'japonais', accent: true },
      { text: ', nouilles ' },
      { text: 'maison', accent: true },
      { text: '. Chaque bol est un petit aller simple pour les ruelles nocturnes d’Osaka.' },
    ] satisfies readonly TextSegment[],
    paragraph:
      'Nos bouillons mijotent longuement et nos nouilles sont préparées chaque jour, à la manière des ramen-ya d’Osaka. Une cuisine de caractère, généreuse et sans détour, servie chez Yoru Osaka.',
    discoverLabel: 'Découvrir la carte',
    tags: [
      'Bouillons maison',
      'Nouilles fraîches',
      'Produits frais',
      'Ramen bar',
      'Street-food',
      'Osaka',
    ],
  },
  ingredients: {
    index: '(02)',
    eyebrow: 'Petite star des bars à ramen',
    // Espace insécable avant « ? » : le point d'interrogation ne passe jamais seul à la ligne.
    title: 'Le ramen, c’est quoi ?',
    items: [
      {
        title: 'Le bouillon',
        description:
          'Un bouillon tonkotsu, riche et onctueux, mijoté pendant de longues heures pour révéler toute sa profondeur.',
      },
      {
        title: 'Les nouilles',
        description: 'Des nouilles fraîches et fermes, qui capturent parfaitement le bouillon.',
      },
      {
        title: 'La garniture',
        description:
          'Porc tendre, œuf mariné, oignons verts et une touche épicée pour un équilibre parfait.',
      },
      {
        title: 'La tare',
        description:
          'L’assaisonnement versé au fond du bol, à base de sauce soja, de mirin et de sel, qui donne son caractère au bouillon.',
      },
      {
        title: 'L’huile parfumée',
        description:
          'Quelques gouttes d’huile infusée à l’ail et à la ciboule, ajoutées au dernier moment pour le parfum.',
      },
    ],
  },
  ramens: {
    index: '(03)',
    title: 'Les ramens',
    tagline: ['Nouilles, bouillons,', 'pur plaisir.'],
    dishCta: 'Voir le plat',
    // `id` fait le lien avec l'image du plat dans images.ts.
    dishes: [
      {
        id: 'tonkotsu',
        name: 'Tonkotsu',
        description:
          'Bouillon de porc crémeux, nouilles maison, porc pané croustillant, œuf ajitama, nori et oignons verts.',
      },
      {
        id: 'miso',
        name: 'Miso ramen',
        description:
          'Bouillon miso généreux, nouilles maison, chashu, maïs doux, pousses de soja, œuf ajitama et piment.',
      },
      {
        id: 'tantanmen',
        name: 'Tantanmen',
        description:
          'Bouillon pimenté au sésame, nouilles maison, porc haché épicé, pak choï et œuf ajitama.',
      },
      {
        id: 'shio',
        name: 'Shio ramen',
        description:
          'Bouillon de volaille clair au sel, nouilles maison, poulet rôti, menma, œuf ajitama et oignons verts.',
      },
    ],
  },
  menu: {
    index: '(04)',
    eyebrow: 'La carte',
    title: 'Plus qu’un ramen',
    tabsLabel: 'Catégories de la carte',
  },
  categories: {
    // Titre lu par les lecteurs d'écran uniquement : la maquette n'affiche pas de titre de section.
    title: 'Au menu',
    // `id` fait le lien avec l'image (images.ts), `target` avec l'ancre visée (navigation.ts).
    cards: [
      { id: 'ramens', title: 'Slurp.', linkLabel: 'Nos ramens', target: 'ramens' },
      { id: 'karaage', title: 'Croque.', linkLabel: 'Nos karaage', target: 'menu' },
      { id: 'drinks', title: 'Trinque.', linkLabel: 'Nos boissons', target: 'menu' },
    ],
  },
  combos: {
    title: 'L’échelle de faim',
    intro: 'Un ramen au choix, des sides et une boisson. Choisis ton niveau de faim.',
  },
  street: {
    japanese: '大阪ラーメン',
    // Traduction du titre japonais, lue par les lecteurs d'écran.
    translation: 'Osaka Ramen',
    // Légende qui apparaît sous le titre une fois la vidéo plein écran.
    caption: 'Yoru Ramen, le vrai ramen d’Osaka dans les rues de Dotonbori',
  },
  contact: {
    // Espace insécable avant « ? » : le point d'interrogation ne passe jamais seul à la ligne.
    title: 'Une petite faim ?',
    // Description de chaque carte d'action, associée au lien de même nom dans navigation.ts.
    actions: {
      clickAndCollect: 'Commande en ligne, récupère au resto.',
      delivery: 'Livrée chez toi par nos partenaires.',
      booking: 'Une table pour ce soir, ou un autre soir.',
    },
    directions: 'Itinéraire & horaires',
    // Annoncé par les lecteurs d'écran : le lien ouvre Google Maps.
    directionsHint: '(Google Maps)',
    signature: 'Ramen à Osaka, Dotonbori',
  },
  socials: {
    eyebrow: 'Réseaux sociaux',
    title: 'Rejoins la Yoru family',
    paragraph:
      'Nouveaux bols, soirées spéciales, coulisses de la cuisine : suis-nous pour ne rien rater de ce qui mijote chez Yoru Osaka. Et tague-nous quand tu slurpes !',
  },
  footer: {
    // Slogan en deux lignes ; la seconde, en rouge, est précédée de la pastille.
    slogan: { first: 'Good food', second: 'Good night!' },
    columns: { address: 'Adresse', contact: 'Contact', order: 'Commander', follow: 'Suivre' },
    backToTop: 'Retour en haut',
  },
} as const;
