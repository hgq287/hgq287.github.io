import { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '../lib/site-config';

/** Required for `output: 'export'` (static HTML export). */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
