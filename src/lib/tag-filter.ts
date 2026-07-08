import { Post, PostMetadata } from '../types/post.types';

export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function postHasTag(post: Pick<PostMetadata, 'tags'>, tag: string): boolean {
  const needle = normalizeTag(tag);
  if (!needle) return false;
  return post.tags.some((t) => normalizeTag(t) === needle);
}

export function filterPostsByTag<T extends PostMetadata>(posts: T[], tag: string | null): T[] {
  if (!tag) return posts;
  return posts.filter((post) => postHasTag(post, tag));
}

export function resolveDisplayPost(posts: Post[], preferredSlug?: string | null): Post | null {
  if (posts.length === 0) return null;
  if (preferredSlug) {
    const match = posts.find((post) => post.slug === preferredSlug);
    if (match) return match;
  }
  return posts[0];
}
