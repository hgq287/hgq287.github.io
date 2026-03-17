import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '../types/post.types';

const SYSTEMS_DIR = path.join(process.cwd(), 'public/content/systems');

export const SystemsRepository = {
  async getAllPostsMetadata(): Promise<PostMetadata[]> {
    try {
      if (!fs.existsSync(SYSTEMS_DIR)) return [];
      const files = fs.readdirSync(SYSTEMS_DIR);
      const list: PostMetadata[] = files
        .filter((f) => f.endsWith('.md'))
        .map((filename) => {
          const slug = filename.replace(/\.md$/, '');
          const raw = fs.readFileSync(path.join(SYSTEMS_DIR, filename), 'utf-8');
          const { data } = matter(raw);
          return {
            slug,
            title: data.title || slug,
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            excerpt: data.excerpt || '',
            tags: data.tags || [],
          } as PostMetadata;
        });
      list.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
      return list;
    } catch (error) {
      console.error('Error reading systems content:', error);
      return [];
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    const filePath = path.join(SYSTEMS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      content,
    } as Post;
  },
};
