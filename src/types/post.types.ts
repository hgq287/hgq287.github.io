export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  /** When true, surfaced first on the home feed (Systems + Blog merged). */
  featured?: boolean;
}

export interface Post extends PostMetadata {
  content: string;
}

export interface TableOfContentsItem {
  text: string;
  slug: string;
  level: number;
}