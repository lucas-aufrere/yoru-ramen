export const site = {
  name: 'Yoru Osaka',
  // Année affichée dans le copyright du footer : à mettre à jour chaque année.
  copyrightYear: 2026,
  // URL de production à définir dans l'environnement (NEXT_PUBLIC_SITE_URL) avant la mise en ligne.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  // PROVISOIRE : coordonnées fictives, à remplacer par les vraies. Elles doivent être
  // strictement identiques partout (site, Google Business Profile, réseaux) pour le SEO local.
  address: {
    street: '12 rue de l’Exemple',
    postalCode: '75000',
    city: 'Paris',
  },
  // Numéro de la plage 01 99 00, réservée par l'ARCEP aux œuvres de fiction.
  phone: { display: '01 99 00 12 34', international: '+33199001234' },
  // Domaine réservé aux exemples (RFC 2606).
  email: 'bonjour@example.com',

  // PROVISOIRE : pages d'accueil des réseaux, à remplacer par les comptes du restaurant.
  socials: [
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'TikTok', href: 'https://www.tiktok.com/' },
  ],
} as const;
