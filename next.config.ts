import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Racine explicite : un package-lock.json dans un dossier parent fausserait la détection automatique.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  sassOptions: {
    // Permet `@use 'abstracts' as *;` depuis n'importe quel module SCSS.
    loadPaths: [path.join(process.cwd(), 'src/styles')],
  },
};

export default nextConfig;
