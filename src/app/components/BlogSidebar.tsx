"use client";

import Link from "next/link";
import { PostMeta } from "../../utils/posts/posts";

export default function BlogSidebar({ posts }: { posts: PostMeta[] }) {
  return (
    <aside className="w-64 border-r p-4 h-screen overflow-y-auto sticky top-0">
      <h2 className="font-bold mb-4 text-lg">All Posts</h2>

      <ul className="space-y-2">
        {posts.map(p => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="hover:text-blue-600 text-sm"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
