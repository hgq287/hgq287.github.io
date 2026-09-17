import { PostRepository } from './post.repository';
import { SystemsRepository } from './systems.repository';
import { OpsRepository } from './ops.repository';
import { PostMetadata } from '../types/post.types';
import { CONTENT_SECTION_LABEL, type ContentSection } from '../lib/content-sections';

export type HomeFeedSource = ContentSection;

export type HomeFeedItem = PostMetadata & {
  source: HomeFeedSource;
  href: string;
  sourceLabel: string;
};

const DEFAULT_HOME_FEED_LIMIT = 3;

function mergeAndSort(
  blog: PostMetadata[],
  systems: PostMetadata[],
  ops: PostMetadata[]
): HomeFeedItem[] {
  const items: HomeFeedItem[] = [
    ...blog.map((p) => ({
      ...p,
      featured: p.featured === true,
      source: 'blog' as const,
      href: `/blog/${p.slug}`,
      sourceLabel: CONTENT_SECTION_LABEL.blog,
    })),
    ...systems.map((p) => ({
      ...p,
      featured: p.featured === true,
      source: 'systems' as const,
      href: `/systems/${p.slug}`,
      sourceLabel: CONTENT_SECTION_LABEL.systems,
    })),
    ...ops.map((p) => ({
      ...p,
      featured: p.featured === true,
      source: 'ops' as const,
      href: `/ops/${p.slug}`,
      sourceLabel: CONTENT_SECTION_LABEL.ops,
    })),
  ];

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return items;
}

export async function getHomeFeed(limit = DEFAULT_HOME_FEED_LIMIT): Promise<HomeFeedItem[]> {
  const [blog, systems, ops] = await Promise.all([
    PostRepository.getAllPostsMetadata(),
    SystemsRepository.getAllPostsMetadata(),
    OpsRepository.getAllPostsMetadata(),
  ]);
  return mergeAndSort(blog, systems, ops).slice(0, limit);
}
