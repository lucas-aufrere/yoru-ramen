# CLAUDE.md

Ce fichier définit la stack, l'architecture et les conventions de code du projet.
Il fait référence pour toute contribution, humaine ou IA. En cas de doute, ce document prime.

## 1. Le projet

Site vitrine d'un restaurant de ramen. Le design est déjà finalisé (maquettes fournies) : l'intégration doit être fidèle au pixel près, sur tous les breakpoints.

Caractéristiques principales :

* Site très animé, avec de nombreuses animations au scroll
* Beaucoup de médias : photos et vidéos
* Priorités, dans l'ordre : qualité et lisibilité du code, accessibilité, performance, fidélité au design, SEO

Objectif de maintenabilité : quelqu'un qui reprend le projet dans plusieurs années doit comprendre l'organisation en quelques minutes, sans avoir besoin de l'auteur d'origine.

## 2. Stack technique

| Outil | Rôle |
| --- | --- |
| Next.js (App Router, dernière version stable) | Framework, routing, rendu, optimisation des médias |
| TypeScript (mode `strict`) | Typage de tout le code |
| SCSS via CSS Modules (`*.module.scss`) | Styles, scopés par composant |
| GSAP + ScrollTrigger (+ SplitText si besoin) | Animations |
| `@gsap/react` (`useGSAP`) | Intégration GSAP dans React avec nettoyage automatique |
| Lenis (package `lenis`) | Smooth scroll |

### Interdits

* Pas de Tailwind, pas de librairie CSS-in-JS, pas de framework UI (MUI, Chakra, shadcn, etc.)
* Pas de Framer Motion ni d'autre librairie d'animation
* Pas de jQuery
* Aucune nouvelle dépendance runtime sans validation explicite du développeur

### Outils de développement autorisés (aucun impact runtime)

* ESLint (config Next.js)
* Prettier
* Stylelint (`stylelint-config-standard-scss`)

## 3. Architecture des dossiers

```
.
├── public/
│   ├── videos/                 # Vidéos (webm + mp4) et leurs posters
│   ├── favicon/                # Favicons et icônes d'app
│   └── og/                     # Images Open Graph
├── src/
│   ├── app/                    # Routing Next.js uniquement (pas de logique métier ici)
│   │   ├── layout.tsx          # Layout racine : fonts, providers, metadata globale
│   │   ├── page.tsx            # Page d'accueil : assemble les sections dans l'ordre
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   │
│   ├── sections/               # Une section de page = un dossier
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.module.scss
│   │   │   └── index.ts        # export { Hero } from './Hero';
│   │   ├── Story/
│   │   ├── Menu/
│   │   ├── Gallery/
│   │   └── Contact/
│   │
│   ├── components/             # Composants réutilisables (utilisés par plusieurs sections)
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── ui/                 # Button, Heading, Tag, etc.
│   │   └── media/              # Picture, Video
│   │       (même règle : un composant = un dossier avec .tsx, .module.scss, index.ts)
│   │
│   ├── animations/             # Toutes les animations GSAP, une catégorie par fichier
│   │   ├── index.ts            # Fichier main : enregistre les plugins et réexporte tout
│   │   ├── config.ts           # Durées, easings, staggers, breakpoints partagés
│   │   ├── reveal.ts           # Apparitions (fade, slide, clip-path)
│   │   ├── text.ts             # Animations de texte (SplitText, lignes, lettres)
│   │   ├── parallax.ts         # Parallaxes et effets de profondeur
│   │   ├── media.ts            # Zooms, masques, scrub sur images et vidéos
│   │   └── pin.ts              # Sections épinglées et scroll horizontal
│   │
│   ├── content/                # Tout le contenu éditorial, séparé du code
│   │   ├── site.ts             # Nom, adresse, téléphone, horaires, réseaux sociaux
│   │   ├── texts.ts            # Tous les textes, organisés par section
│   │   ├── images.ts           # Toutes les images (imports statiques + alt)
│   │   ├── videos.ts           # Toutes les vidéos (sources, poster, description)
│   │   ├── menu.ts             # La carte (plats, descriptions, prix, allergènes)
│   │   ├── navigation.ts       # Liens du header et du footer
│   │   └── seo.ts              # Titles, descriptions, données Schema.org
│   │
│   ├── providers/
│   │   └── SmoothScroll/       # Initialisation de Lenis et synchronisation avec GSAP
│   │
│   ├── hooks/                  # Hooks React réutilisables (useReducedMotion, etc.)
│   ├── lib/                    # Fonctions utilitaires pures, sans dépendance à React
│   ├── types/                  # Types TypeScript partagés
│   │
│   ├── styles/
│   │   ├── abstracts/          # Aucun CSS généré ici : uniquement variables, fonctions, mixins
│   │   │   ├── _index.scss     # @forward de tous les fichiers abstracts
│   │   │   ├── _colors.scss
│   │   │   ├── _typography.scss
│   │   │   ├── _spacing.scss
│   │   │   ├── _breakpoints.scss
│   │   │   ├── _z-index.scss
│   │   │   ├── _functions.scss # rem(), fluid(), etc.
│   │   │   └── _mixins.scss    # media queries, reduced motion, visually-hidden
│   │   ├── base/
│   │   │   ├── _reset.scss
│   │   │   ├── _root.scss      # Custom properties CSS (:root)
│   │   │   ├── _typography.scss
│   │   │   └── _lenis.scss     # Styles requis par Lenis
│   │   └── globals.scss        # Point d'entrée, importé une seule fois dans layout.tsx
│   │
│   └── assets/
│       ├── images/             # Images importées statiquement (optimisées par next/image)
│       ├── fonts/              # Fonts locales chargées via next/font/local
│       └── icons/              # SVG
│
├── CLAUDE.md
├── README.md
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
└── .stylelintrc.json
```

### Règles d'architecture

1. **Une section = un dossier** dans `src/sections/`, contenant exactement : `NomSection.tsx`, `NomSection.module.scss`, `index.ts`. Si une section a besoin d'un sous-composant qui ne sert qu'à elle, il va dans un sous-dossier `components/` de la section. S'il sert ailleurs, il remonte dans `src/components/`.
2. **`app/` ne contient que du routing.** `page.tsx` se contente d'importer et d'ordonner les sections.
3. **Aucun texte en dur dans les composants.** Tout texte visible vient de `src/content/`.
4. **Aucune image ni vidéo référencée en dur dans les composants.** Tout passe par `content/images.ts` et `content/videos.ts`.
5. **Aucune animation GSAP écrite directement dans un composant.** Les composants appellent des fonctions de `src/animations/`.
6. **Imports via l'alias `@/`** (`@/sections/Hero`, `@/content/texts`). Pas de chemins relatifs remontants type `../../../`.
7. **Pas de fichier fourre-tout** (`utils.ts` de 800 lignes, `helpers.ts` sans thème). Un fichier = une responsabilité claire.

## 4. Conventions de nommage

| Élément | Convention | Exemple |
| --- | --- | --- |
| Dossiers de sections et composants | PascalCase | `Hero/`, `MenuCard/` |
| Fichiers de composants | PascalCase | `MenuCard.tsx`, `MenuCard.module.scss` |
| Hooks | camelCase préfixé `use` | `useReducedMotion.ts` |
| Fichiers utilitaires, contenu, animations | camelCase | `texts.ts`, `parallax.ts` |
| Fonctions d'animation | verbe + cible, camelCase | `revealFadeUp`, `splitLinesReveal`, `parallaxImage` |
| Classes CSS Modules | camelCase | `.title`, `.mediaWrapper` |
| Variables SCSS | kebab-case | `$color-broth`, `$ease-out-expo` |
| Custom properties CSS | kebab-case | `--color-broth` |
| Constantes globales | SCREAMING_SNAKE_CASE | `HEADER_HEIGHT` |
| Types et interfaces | PascalCase, sans préfixe `I` | `MenuItem`, `VideoSource` |

Le code (variables, fonctions, classes) est en **anglais**. Les commentaires peuvent être en français, mais restent cohérents dans tout le projet.

## 5. Composants React

### Règles générales

* Composants fonctionnels uniquement, exports nommés (pas d'`export default` sauf là où Next.js l'impose : `page.tsx`, `layout.tsx`, etc.).
* **Server Components par défaut.** `'use client'` uniquement quand c'est nécessaire (animations, état, événements), et au niveau le plus bas possible de l'arbre.
* Props typées avec un `type` explicite juste au-dessus du composant.
* Un composant fait une chose. Au-delà d'environ 150 lignes, se demander s'il faut découper.
* Pas de `any`. Pas de `// @ts-ignore`. Si un cas l'exige vraiment, `// @ts-expect-error` avec un commentaire qui explique pourquoi.

### HTML sémantique

* Chaque section est un `<section>` avec un `aria-labelledby` pointant vers son titre.
* Un seul `<h1>` par page, hiérarchie de titres respectée sans saut de niveau.
* `<header>`, `<nav>`, `<main>`, `<footer>`, `<address>`, `<ul>` pour les listes, `<button>` pour les actions, `<a>` pour la navigation.
* Jamais de `<div onClick>`.

### Modèle de section

```tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { revealFadeUp, splitLinesReveal } from '@/animations';
import { texts } from '@/content/texts';
import { images } from '@/content/images';
import { Picture } from '@/components/media/Picture';

import styles from './Story.module.scss';

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      splitLinesReveal('[data-anim="title"]');
      revealFadeUp('[data-anim="text"]');
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.story} aria-labelledby="story-title">
      <h2 id="story-title" className={styles.title} data-anim="title">
        {texts.story.title}
      </h2>
      <p className={styles.text} data-anim="text">
        {texts.story.paragraph}
      </p>
      <Picture image={images.story.chef} className={styles.media} />
    </section>
  );
}
```

Les cibles d'animation sont identifiées par des attributs `data-anim`, jamais par les classes CSS Modules (qui sont hashées et réservées au style).

## 6. Styles (SCSS)

### Principes

* **CSS Modules uniquement** pour les composants. Le CSS global se limite à `styles/base/` et aux custom properties.
* **Syntaxe moderne Sass : `@use` et `@forward`.** `@import` est déprécié et interdit.
* Chaque module commence par : `@use 'abstracts' as *;`
  (configurer `sassOptions.loadPaths` dans `next.config.ts` pour pointer vers `src/styles`).
* **Mobile first** : styles de base pour mobile, puis mixins `breakpoint-up()` pour élargir.
* Unités : `rem` pour les tailles et espacements, `clamp()` pour la typographie et les espacements fluides, `px` uniquement pour les bordures fines. Jamais de valeurs magiques non expliquées.
* Toutes les couleurs, fonts, espacements, easings et z-index viennent des abstracts ou des custom properties. **Aucune valeur de design en dur dans un module.**
* Imbrication limitée à 3 niveaux. Pas de sélecteurs d'ID pour le style. Pas de `!important` (sauf utilitaire documenté).
* Propriétés logiques quand c'est pertinent (`margin-inline`, `padding-block`).
* Ordre des déclarations : positionnement, box model, typographie, visuel, animation, puis media queries.

### Exemple

```scss
@use 'abstracts' as *;

.story {
  position: relative;
  padding-block: $space-section;

  @include breakpoint-up(md) {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
  }
}

.title {
  font-family: var(--font-display);
  font-size: fluid(32, 72);
  line-height: 1.05;
}
```

## 7. Animations (GSAP)

### Organisation

* `src/animations/index.ts` est le **fichier main** : il enregistre les plugins **une seule fois** et réexporte toutes les catégories.

```ts
'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export * from './reveal';
export * from './text';
export * from './parallax';
export * from './media';
export * from './pin';
export { gsap, ScrollTrigger };
```

* Un fichier par **catégorie** d'animation (apparitions, texte, parallaxe, médias, pin). Une nouvelle catégorie = un nouveau fichier, ajouté au `index.ts`.
* `config.ts` centralise durées, easings et staggers. Aucune durée ou easing en dur dans les fichiers de catégorie.

```ts
export const DURATION = { fast: 0.4, base: 0.8, slow: 1.4 } as const;
export const EASE = { out: 'power3.out', inOut: 'power2.inOut', expo: 'expo.out' } as const;
export const STAGGER = { tight: 0.05, base: 0.1 } as const;
```

### Écriture d'une fonction d'animation

* Fonction pure : elle reçoit une cible (sélecteur ou élément) et des options typées, et retourne le tween ou la timeline.
* Options avec des valeurs par défaut issues de `config.ts`.
* Documentée en JSDoc (ce qu'elle fait, ses paramètres).

```ts
import { gsap } from 'gsap';
import { DURATION, EASE, STAGGER } from './config';

type RevealOptions = {
  y?: number;
  stagger?: number;
  start?: string;
};

/**
 * Fait apparaître les éléments en fondu depuis le bas au moment où ils entrent dans le viewport.
 */
export function revealFadeUp(targets: gsap.TweenTarget, options: RevealOptions = {}) {
  const { y = 40, stagger = STAGGER.base, start = 'top 85%' } = options;

  return gsap.from(targets, {
    autoAlpha: 0,
    y,
    duration: DURATION.base,
    ease: EASE.out,
    stagger,
    scrollTrigger: { trigger: targets as gsap.DOMTarget, start },
  });
}
```

### Règles obligatoires

* **Toujours utiliser `useGSAP` avec un `scope`** dans les composants. Il gère le nettoyage (kill des tweens et ScrollTriggers) au démontage. Jamais de `useEffect` pour GSAP.
* Les callbacks déclenchés par des événements (clic, hover) passent par `contextSafe` de `useGSAP`.
* **Animer uniquement `transform` et `opacity`** (via `x`, `y`, `scale`, `rotation`, `autoAlpha`) autant que possible. Pas d'animation de `width`, `height`, `top`, `left`, `margin`.
* `will-change` uniquement de façon ciblée et temporaire, jamais en global.
* `markers: true` interdit dans le code commité.
* Ne pas cacher le contenu en CSS en attendant le JS : les états initiaux sont posés par GSAP (`gsap.from` ou `gsap.set` dans `useGSAP`) pour que le site reste lisible si le JS échoue.
* Appeler `ScrollTrigger.refresh()` après le chargement des fonts et des médias qui modifient la hauteur de la page.

### Accessibilité des animations

* **`prefers-reduced-motion` est respecté partout**, via `gsap.matchMedia()` :
  * mouvement réduit : pas de parallaxe, pas de scrub, pas de pin, uniquement des fondus courts ou aucune animation
  * le contenu reste toujours accessible et visible
* SplitText : conserver l'accessibilité du texte découpé (option `aria` de SplitText, texte lisible par les lecteurs d'écran) et appeler `revert()` au nettoyage.
* Aucune animation ne doit bloquer l'accès au contenu ou la navigation clavier.

## 8. Smooth scroll (Lenis)

* Lenis est initialisé **une seule fois** dans `src/providers/SmoothScroll/`, monté dans `layout.tsx`.
* Lenis est piloté par le ticker GSAP (une seule boucle `requestAnimationFrame` pour tout le site) :

```ts
const lenis = new Lenis({ autoRaf: false });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

* Nettoyage complet au démontage (`lenis.destroy()`, retrait de la fonction du ticker).
* Si `prefers-reduced-motion` est actif, Lenis n'est pas initialisé (scroll natif).
* Les styles recommandés par Lenis sont dans `styles/base/_lenis.scss`.
* Les ancres internes utilisent `lenis.scrollTo()` pour rester cohérentes avec le smooth scroll.
* Les zones scrollables internes (modale, menu) utilisent l'attribut `data-lenis-prevent`.

## 9. Contenu (`src/content/`)

Toute donnée éditoriale vit ici, typée, et rien d'autre. Un futur changement de texte, de photo ou de prix ne doit jamais nécessiter de toucher à un composant.

### Textes

```ts
export const texts = {
  hero: {
    title: '...',
    subtitle: '...',
    cta: '...',
  },
  story: {
    title: '...',
    paragraph: '...',
  },
} as const;
```

Organisés par section, dans le même ordre que la page.

### Images

```ts
import type { StaticImageData } from 'next/image';

import heroBowl from '@/assets/images/hero/bowl.jpg';

export type SiteImage = {
  src: StaticImageData;
  alt: string;
};

export const images = {
  hero: {
    bowl: { src: heroBowl, alt: 'Bol de ramen tonkotsu avec œuf mariné et chashu' },
  },
} satisfies Record<string, Record<string, SiteImage>>;
```

* Imports statiques : Next.js récupère automatiquement dimensions et placeholder flou.
* **`alt` obligatoire et descriptif.** `alt: ''` uniquement pour une image purement décorative, et c'est un choix assumé.

### Vidéos

```ts
export type SiteVideo = {
  sources: { src: string; type: 'video/webm' | 'video/mp4' }[];
  poster: string;
  description: string;
};
```

### Carte du restaurant

`menu.ts` contient la carte sous forme de données typées (catégorie, nom, description, prix, allergènes, options végétariennes). Les prix sont des nombres, formatés à l'affichage avec `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`.

## 10. Médias

### Images

* Toujours via `next/image`, encapsulé dans le composant `components/media/Picture`.
* Attribut `sizes` renseigné correctement pour chaque usage (sinon images trop lourdes).
* `priority` (ou l'équivalent de la version Next.js en cours) uniquement pour l'image LCP du hero.
* Formats modernes (AVIF / WebP) activés dans `next.config.ts`.
* Sources d'origine exportées à la bonne taille : pas d'images de 6000 px dans le repo.

### Vidéos

Toutes les vidéos passent par le composant `components/media/Video` :

* Attributs : `muted`, `playsInline`, `loop` si besoin, `preload="none"` ou `"metadata"`, `poster` obligatoire
* Deux sources : WebM puis MP4 en fallback
* Lecture **uniquement quand la vidéo est visible** (IntersectionObserver ou callbacks ScrollTrigger), pause hors écran
* Si `prefers-reduced-motion` : pas d'autoplay, affichage du poster
* Vidéos compressées et sans piste audio quand elles sont décoratives
* Vidéo porteuse d'information : contrôles accessibles et sous-titres

## 11. Performance

Objectifs : Lighthouse 90+ sur toutes les catégories, Core Web Vitals dans le vert (LCP < 2,5 s, INP < 200 ms, CLS < 0,1).

* Fonts via `next/font` (auto-hébergées, `display: swap`, sous-ensembles limités).
* Aucun décalage de mise en page : dimensions réservées pour tous les médias.
* Les sections lourdes sous la ligne de flottaison peuvent être chargées avec `next/dynamic` si le bundle le justifie.
* Pas de calcul coûteux dans les callbacks de scroll.
* Vérifier régulièrement le poids du bundle et l'onglet Performance du navigateur.

## 12. SEO

* Metadata via l'API `metadata` de Next.js, alimentée par `content/seo.ts`.
* Open Graph et Twitter Cards complets.
* Données structurées **Schema.org `Restaurant`** en JSON-LD (adresse, horaires, téléphone, type de cuisine, carte, fourchette de prix), générées depuis `content/site.ts`.
* `sitemap.ts` et `robots.ts` générés par Next.js.
* `lang="fr"` sur `<html>`.
* Coordonnées (NAP) identiques partout : site, Google Business Profile, réseaux.

## 13. Accessibilité

Cible : WCAG 2.2 niveau AA.

* Navigation complète au clavier, focus visible et stylé (`:focus-visible`), jamais supprimé.
* Lien d'évitement « Aller au contenu » en début de page.
* Contrastes conformes AA.
* Zones cliquables d'au moins 24 × 24 px (44 × 44 px visé sur mobile).
* Menu mobile : `aria-expanded`, `aria-controls`, fermeture à `Échap`, gestion du focus.
* Tester au lecteur d'écran (VoiceOver ou NVDA) avant chaque mise en production.

## 14. Qualité de code

* Code lisible avant tout : noms explicites, fonctions courtes, pas d'astuce obscure.
* Commentaires pour expliquer le **pourquoi**, pas le quoi. Pas de code commenté laissé dans le repo.
* Pas de `console.log` commité.
* Pas de duplication : un même motif répété 3 fois devient une fonction, un mixin ou un composant.
* ESLint, Prettier et Stylelint passent sans erreur ni warning avant chaque commit.
* `tsc --noEmit` passe sans erreur.

### Scripts attendus dans `package.json`

```
dev          Lance le serveur de développement
build        Build de production
start        Lance le build de production
lint         ESLint
lint:styles  Stylelint
format       Prettier
typecheck    tsc --noEmit
```

### Git

* Commits au format **Conventional Commits** : `feat:`, `fix:`, `style:`, `refactor:`, `perf:`, `docs:`, `chore:`.
* Un commit = une modification cohérente.
* Branches : `main` (production), `feat/nom-de-la-feature`, `fix/nom-du-bug`.

## 15. Instructions pour Claude

* Lire ce fichier en entier avant toute modification.
* Respecter strictement la stack : ne jamais proposer ni installer Tailwind, Framer Motion ou toute autre librairie non listée. Toute nouvelle dépendance doit être validée par le développeur.
* Suivre l'architecture à la lettre : nouvelle section = nouveau dossier dans `sections/` avec ses trois fichiers, nouvelle animation = fonction dans le bon fichier de `animations/`, nouveau texte ou média = entrée dans `content/`.
* Intégrer fidèlement le design fourni. Ne pas inventer de couleurs, d'espacements ou de typographies : utiliser les tokens existants, et demander si une valeur manque.
* Pour toute API GSAP, Lenis ou Next.js dont la syntaxe a pu évoluer, vérifier dans la documentation officielle à jour plutôt que de se fier à la mémoire.
* Avant de considérer une tâche terminée : lint, typecheck et build passent, aucune erreur console, rendu vérifié en mobile et desktop, comportement vérifié avec `prefers-reduced-motion` activé.
* Signaler toute incohérence entre le design, ce document et le code au lieu de la contourner silencieusement.
