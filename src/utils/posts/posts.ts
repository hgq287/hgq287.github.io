import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  cover?: string;
  tags: string[];
};

export type Post = PostMeta & { content: string };

const POSTS_DIR = path.join(process.cwd(), "public/content/posts");

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(POSTS_DIR);

  return files
    .filter(f => f.endsWith(".md"))
    .map(filename => {
      const slug = filename.replace(".md", "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        excerpt: data.excerpt || "",
        cover: data.cover || "",
        tags: data.tags || [],
        content
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post {
  const file = fs.readFileSync(
    path.join(POSTS_DIR, slug + ".md"),
    "utf-8"
  );
  const { data, content } = matter(file);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    cover: data.cover,
    tags: data.tags,
    content,
  };
}

export function getPostsByPage(page = 1, pageSize = 10) {
  const posts = getAllPosts();
  const start = (page - 1) * pageSize;
  return posts.slice(start, start + pageSize);
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter(p => p.tags.includes(tag));
}