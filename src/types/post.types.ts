export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface Post extends PostMetadata {
  content: string;
}

export interface TableOfContentsItem {
  text: string;
  slug: string;
  level: number;
}