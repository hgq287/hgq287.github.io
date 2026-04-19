import { PostRepository } from './post.repository';
import { SystemsRepository } from './systems.repository';
import { PostMetadata } from '../types/post.types';

export type HomeFeedSource = 'blog' | 'systems';

export type HomeFeedItem = PostMetadata & {
  source: HomeFeedSource;
  href: string;
};

const DEFAULT_HOME_FEED_LIMIT = 3;

function mergeAndSort(blog: PostMetadata[], systems: PostMetadata[]): HomeFeedItem[] {
  const items: HomeFeedItem[] = [
    ...blog.map((p) => ({
      ...p,
      featured: p.featured === true,
      source: 'blog' as const,
      href: `/blog/${p.slug}`,
    })),
    ...systems.map((p) => ({
      ...p,
      featured: p.featured === true,
      source: 'systems' as const,
      href: `/systems/${p.slug}`,
    })),
  ];

  items.sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (bf !== af) return bf - af;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return items;
}

export async function getHomeFeed(limit = DEFAULT_HOME_FEED_LIMIT): Promise<HomeFeedItem[]> {
  const [blog, systems] = await Promise.all([
    PostRepository.getAllPostsMetadata(),
    SystemsRepository.getAllPostsMetadata(),
  ]);
  return mergeAndSort(blog, systems).slice(0, limit);
}
