'use client';

import Link from 'next/link';
import { PostMetadata } from '../../types/post.types';

interface BlogSidebarProps {
  allPostsMetadata: PostMetadata[];
  activeSlug: string;
}

export default function BlogSidebar({ allPostsMetadata, activeSlug }: BlogSidebarProps) {
  return (
    <aside className="blog-sidebar-wrap">
      <h2 className="blog-sidebar-title">All Posts</h2>
      <nav aria-label="Blog posts">
        <ul className="blog-sidebar-list">
          {allPostsMetadata.map((post) => {
            const isActive = post.slug === activeSlug;
            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={isActive ? 'is-active' : undefined}
                >
                  {post.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
