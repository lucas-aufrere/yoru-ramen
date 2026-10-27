import type { Metadata } from 'next';
import { Archivo, Fira_Sans, IBM_Plex_Mono, Noto_Sans_JP } from 'next/font/google';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { anchors } from '@/content/navigation';
import { seo } from '@/content/seo';
import { SmoothScroll } from '@/providers/SmoothScroll';

import '@/styles/globals.scss';

const fontDisplay = Archivo({
  subsets: ['latin'],
  weight: '900',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const fontText = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-text',
});

const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-mono',
});

// Idéogrammes japonais : sans préchargement, le navigateur ne télécharge que les tranches de la
// police (unicode-range) contenant les caractères réellement affichés.
const fontJapanese = Noto_Sans_JP({
  subsets: ['latin'],
  weight: '900',
  display: 'swap',
  preload: false,
  variable: '--font-japanese',
});

export const metadata: Metadata = seo;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="fr"
      className={[fontDisplay, fontText, fontMono, fontJapanese]
        .map((font) => font.variable)
        .join(' ')}
    >
      <body>
        <SmoothScroll>
          <SkipLink targetId={anchors.main} />
          <Header />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
