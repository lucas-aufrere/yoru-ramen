export type NavLink = {
  label: string;
  href: string;
};

// Identifiants des sections de la page, partagés entre les liens et les sections.
export const anchors = {
  top: 'top',
  main: 'contenu',
  menu: 'carte',
  story: 'histoire',
  gallery: 'galerie',
  contact: 'infos',
  ramens: 'ramens',
} as const;

export const navigation = {
  header: [
    { label: 'La carte', href: `#${anchors.menu}` },
    { label: 'L’histoire', href: `#${anchors.story}` },
    { label: 'Galerie', href: `#${anchors.gallery}` },
    { label: 'Infos', href: `#${anchors.contact}` },
  ],
  footer: [],
  // PROVISOIRE : liens à remplacer par les URL des services (réservation, commande, livraison)
  // quand ils seront connus. En attendant, ils mènent aux infos pratiques.
  booking: { label: 'Réserver', href: `#${anchors.contact}` },
  clickAndCollect: { label: 'Click & collect', href: `#${anchors.contact}` },
  delivery: { label: 'Livraison', href: `#${anchors.contact}` },
} satisfies Record<string, NavLink[] | NavLink>;
