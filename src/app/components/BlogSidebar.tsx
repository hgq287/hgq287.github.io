'use client';

import Link from 'next/link';
import { PostMetadata } from '../../types/post.types';

interface BlogSidebarProps {
  allPostsMetadata: PostMetadata[];
  activeSlug: string;
  basePath?: string;
  sidebarTitle?: string;
}

export default function BlogSidebar({
  allPostsMetadata,
  activeSlug,
  basePath = '/blog',
  sidebarTitle = 'All Posts',
}: BlogSidebarProps) {
  return (
    <aside className="blog-sidebar-wrap">
      <h2 className="blog-sidebar-title">{sidebarTitle}</h2>
      <nav aria-label={sidebarTitle}>
        <ul className="blog-sidebar-list">
          {allPostsMetadata.map((post) => {
            const isActive = post.slug === activeSlug;
            return (
              <li key={post.slug}>
                <Link
                  href={`${basePath}/${post.slug}`}
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
