export type SiteVideo = {
  sources: { src: string; type: 'video/webm' | 'video/mp4' }[];
  poster: string;
  description: string;
};

export const videos = {
  hero: {
    ramen: {
      sources: [
        { src: '/videos/hero-ramen.webm', type: 'video/webm' },
        { src: '/videos/hero-ramen.mp4', type: 'video/mp4' },
      ],
      poster: '/videos/hero-ramen-poster.jpg',
      description:
        'Bol de ramen fumant avec chashu grillé, œuf mariné, ciboule et feuille de nori, sur un comptoir en bois.',
    },
  },
  street: {
    osaka: {
      sources: [
        { src: '/videos/osaka-street.webm', type: 'video/webm' },
        { src: '/videos/osaka-street.mp4', type: 'video/mp4' },
      ],
      poster: '/videos/osaka-street-poster.jpg',
      description:
        'Ruelle d’Osaka la nuit, enseignes lumineuses et passants, floutée en arrière-plan.',
    },
  },
} satisfies Record<string, Record<string, SiteVideo>>;
