import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '../types/post.types';

const POSTS_DIR = path.join(process.cwd(), 'public/content/posts');

export const PostRepository = {
  async getAllPostsMetadata(): Promise<PostMetadata[]> {
    try {
      const files = fs.readdirSync(POSTS_DIR);
      
      const postsMetadata: PostMetadata[] = files
          .filter(f => f.endsWith(".md"))
        .map(filename => {
            const slug = filename.replace(/\.md$/, "");
            const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
            const { data } = matter(raw);

            return {
                slug: slug,
                title: data.title || slug,
                date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                excerpt: data.excerpt || "",
                tags: data.tags || [],
            } as PostMetadata;
        });
      
      postsMetadata.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
      return postsMetadata;

    } catch (error) {
        console.error("Lỗi khi đọc file bài viết:", error);
        return []; 
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    console.log(`Fetching post by slug: ${slug}`);
    const filename = `${slug}.md`;
    const filePath = path.join(POSTS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      slug: slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      content: content,
    } as Post;
  }
};