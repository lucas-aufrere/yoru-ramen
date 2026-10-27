import type { Metadata } from 'next';

import { site } from '@/content/site';

export const seo = {
  metadataBase: new URL(site.url),
  title: site.name,
} satisfies Metadata;
