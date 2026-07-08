'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PostMetadata } from '../../types/post.types';

const MOBILE_PREVIEW_ALL = 3;
const MOBILE_PREVIEW_TAGGED = 5;

interface BlogSidebarProps {
  allPostsMetadata: PostMetadata[];
  activeSlug: string;
  basePath?: string;
  sidebarTitle?: string;
  /** When set, sidebar links stay on the index page and preserve the tag filter. */
  activeTag?: string | null;
  /** Desktop sticky column vs mobile list above the article. */
  variant?: 'desktop' | 'mobile';
}

function previewPosts(
  posts: PostMetadata[],
  activeSlug: string,
  limit: number
): PostMetadata[] {
  if (posts.length <= limit) return posts;

  const preview = posts.slice(0, limit);
  if (preview.some((post) => post.slug === activeSlug)) return preview;

  const active = posts.find((post) => post.slug === activeSlug);
  if (!active) return preview;

  return [...preview.slice(0, limit - 1), active];
}

export default function BlogSidebar({
  allPostsMetadata,
  activeSlug,
  basePath = '/blog',
  sidebarTitle = 'All Posts',
  activeTag = null,
  variant = 'desktop',
}: BlogSidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const isMobile = variant === 'mobile';
  const previewLimit = activeTag ? MOBILE_PREVIEW_TAGGED : MOBILE_PREVIEW_ALL;
  const canCollapse = isMobile && allPostsMetadata.length > previewLimit;

  useEffect(() => {
    setExpanded(false);
  }, [activeTag, allPostsMetadata.length]);

  const visiblePosts = useMemo(() => {
    if (!canCollapse || expanded) return allPostsMetadata;
    return previewPosts(allPostsMetadata, activeSlug, previewLimit);
  }, [allPostsMetadata, activeSlug, canCollapse, expanded, previewLimit]);

  const wrapClass = isMobile ? 'blog-related-mobile' : 'blog-sidebar-wrap';
  const ariaLabel = activeTag ? `Tagged ${activeTag}` : sidebarTitle;
  const hiddenCount = Math.max(allPostsMetadata.length - previewLimit, 0);

  return (
    <aside className={wrapClass}>
      <h2 className="blog-sidebar-title">
        {activeTag ? (
          <>
            <span className="blog-sidebar-title-prefix">Tagged</span>{' '}
            <span className="post-meta-tag tag-filter-active-tag">#{activeTag}</span>
          </>
        ) : (
          sidebarTitle
        )}
      </h2>
      <nav aria-label={ariaLabel}>
        <ul className="blog-sidebar-list">
          {visiblePosts.map((post) => {
            const isActive = post.slug === activeSlug;
            const href = activeTag
              ? `${basePath}?tag=${encodeURIComponent(activeTag)}&slug=${encodeURIComponent(post.slug)}`
              : `${basePath}/${post.slug}`;

            return (
              <li key={post.slug}>
                <Link href={href} className={isActive ? 'is-active' : undefined}>
                  {post.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {canCollapse && (
        <button
          type="button"
          className="blog-related-more"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `More (${hiddenCount})`}
        </button>
      )}
    </aside>
  );
}
