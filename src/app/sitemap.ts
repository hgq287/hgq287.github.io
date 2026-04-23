import { MetadataRoute } from 'next';
import { PostRepository } from '../data/post.repository';

/** Required for `output: 'export'` (static HTML export). */
export const dynamic = 'force-static';
import { SystemsRepository } from '../data/systems.repository';
import { SITE_ORIGIN } from '../lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blog, systems] = await Promise.all([
    PostRepository.getAllPostsMetadata(),
    SystemsRepository.getAllPostsMetadata(),
  ]);

  const base = new URL(SITE_ORIGIN);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: new URL('/', base).href, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: new URL('/blog', base).href, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: new URL('/systems', base).href, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];

  const blogUrls: MetadataRoute.Sitemap = blog.map((p) => ({
    url: new URL(`/blog/${p.slug}`, base).href,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const systemsUrls: MetadataRoute.Sitemap = systems.map((p) => ({
    url: new URL(`/systems/${p.slug}`, base).href,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogUrls, ...systemsUrls];
}
