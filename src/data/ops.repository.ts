import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '../types/post.types';

const OPS_DIR = path.join(process.cwd(), 'public/content/ops');

/** Cloud notes that used to live under `/systems/[slug]`. */
export const OPS_SLUGS_MOVED_FROM_SYSTEMS = [
  'cloud-run-cost-defense-armor-cdn',
  'cloud-run-terraform-artifact-registry-delivery-flow',
] as const;

export const OpsRepository = {
  async getAllPostsMetadata(): Promise<PostMetadata[]> {
    try {
      if (!fs.existsSync(OPS_DIR)) return [];
      const files = fs.readdirSync(OPS_DIR);
      const list: PostMetadata[] = files
        .filter((f) => f.endsWith('.md'))
        .map((filename) => {
          const slug = filename.replace(/\.md$/, '');
          const raw = fs.readFileSync(path.join(OPS_DIR, filename), 'utf-8');
          const { data } = matter(raw);
          return {
            slug,
            title: data.title || slug,
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            excerpt: data.excerpt || '',
            tags: data.tags || [],
            featured: data.featured === true,
          } as PostMetadata;
        });
      list.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
      return list;
    } catch (error) {
      console.error('Error reading ops content:', error);
      return [];
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    const filePath = path.join(OPS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      featured: data.featured === true,
      content,
    } as Post;
  },

  async getAllPosts(): Promise<Post[]> {
    const metadata = await this.getAllPostsMetadata();
    const posts = await Promise.all(metadata.map((item) => this.getPostBySlug(item.slug)));
    return posts.filter((post): post is Post => post !== null);
  },
};
