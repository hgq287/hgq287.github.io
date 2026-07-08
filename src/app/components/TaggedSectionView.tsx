'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Post } from '../../types/post.types';
import { filterPostsByTag, resolveDisplayPost } from '../../lib/tag-filter';
import BlogHeader from './BlogHeader';
import ArticleMarkdown from './ArticleMarkdown';
import ArticleMiniMap from './ArticleMiniMap';
import BlogSidebar from './BlogSidebar';
import PostMeta from './PostMeta';
import SiteFooter from './SiteFooter';
import TagFilterChip from './TagFilterChip';

export default function TaggedSectionView({
  posts,
  basePath,
  sectionTitle,
  sidebarTitle,
  emptyLabel,
}: {
  posts: Post[];
  basePath: '/blog' | '/systems';
  sectionTitle: string;
  sidebarTitle: string;
  emptyLabel: string;
}) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag')?.trim() || null;
  const selectedSlug = searchParams.get('slug')?.trim() || null;

  const filteredPosts = useMemo(
    () => filterPostsByTag(posts, activeTag),
    [posts, activeTag]
  );

  const displayPost = useMemo(
    () => resolveDisplayPost(filteredPosts, selectedSlug),
    [filteredPosts, selectedSlug]
  );

  if (posts.length === 0) {
    return (
      <div className="blog-page">
        <BlogHeader title={sectionTitle} headline={`No ${emptyLabel} yet`} />
        <div className="blog-layout">
          <main className="blog-main">
            <p className="blog-prose" style={{ marginTop: '2rem' }}>
              No {emptyLabel} to display.
            </p>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (activeTag && filteredPosts.length === 0) {
    return (
      <div className="blog-page">
        <BlogHeader title={sectionTitle} headline={`No ${emptyLabel} tagged #${activeTag}`} />
        <div className="blog-layout">
          <main className="blog-main">
            <TagFilterChip tag={activeTag} clearHref={basePath} />
            <p className="blog-prose" style={{ marginTop: '1rem' }}>
              No {emptyLabel} match <strong>#{activeTag}</strong>.
            </p>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!displayPost) {
    return null;
  }

  const listTitle = sidebarTitle;

  return (
    <div className="blog-page">
      <BlogHeader title={displayPost.title} headline={displayPost.excerpt} />
      <div className="blog-layout">
        <BlogSidebar
          allPostsMetadata={filteredPosts}
          activeSlug={displayPost.slug}
          basePath={basePath}
          sidebarTitle={listTitle}
          activeTag={activeTag}
          variant="desktop"
        />
        <main className="blog-main">
          {activeTag && <TagFilterChip tag={activeTag} clearHref={basePath} />}
          <BlogSidebar
            allPostsMetadata={filteredPosts}
            activeSlug={displayPost.slug}
            basePath={basePath}
            sidebarTitle={listTitle}
            activeTag={activeTag}
            variant="mobile"
          />
          <article>
            <h1 className="blog-article-title">{displayPost.title}</h1>
            <div className="blog-article-meta">
              <PostMeta date={displayPost.date} tags={displayPost.tags} tagBasePath={basePath} />
            </div>
            <div className="blog-prose">
              <ArticleMarkdown content={displayPost.content} />
            </div>
          </article>
        </main>
        <ArticleMiniMap content={displayPost.content} />
      </div>
      <SiteFooter />
    </div>
  );
}
