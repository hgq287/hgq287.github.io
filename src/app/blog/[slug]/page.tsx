import BlogHeader from '../../components/BlogHeader';
import { Metadata } from 'next';
import Link from 'next/link';

import { PostRepository } from '../../../data/post.repository';
import { buildArticleJsonLd } from '../../../lib/json-ld';
import { OG_IMAGE_PATH, SITE_ORIGIN } from '../../../lib/site-config';

import ArticleMarkdown from '../../components/ArticleMarkdown';
import ArticleMiniMap from '../../components/ArticleMiniMap';
import BlogSidebar from '../../components/BlogSidebar';
import PostMeta from '../../components/PostMeta';
import SiteFooter from '../../components/SiteFooter';
import { JsonLd } from '../../components/JsonLd';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await PostRepository.getAllPostsMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await PostRepository.getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found | Hg's Portfolio" };
  }

  const path = `/blog/${post.slug}`;
  const publishedTime = new Date(post.date).toISOString();
  const ogImage = {
    url: OG_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: post.title,
  };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'article',
      url: path,
      siteName: "Hg's Portfolio",
      title: post.title,
      description: post.excerpt,
      publishedTime,
      tags: post.tags,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const currentPost = await PostRepository.getPostBySlug(slug);

  if (!currentPost) {
    return (
      <div className="blog-page">
        <BlogHeader title="Blog" headline="Post not found" />
        <div className="blog-layout">
          <main className="blog-main">
            <h1 className="blog-article-title">404</h1>
            <p className="blog-prose" style={{ marginTop: '1rem' }}>Page not found.</p>
            <Link href="/blog" className="blog-prose" style={{ marginTop: '1rem', display: 'inline-block' }}>
              &larr; Back to Blog
            </Link>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const allPostsMetadata = await PostRepository.getAllPostsMetadata();

  const articleUrl = `${SITE_ORIGIN}/blog/${currentPost.slug}`;
  const articleJsonLd = buildArticleJsonLd({
    headline: currentPost.title,
    description: currentPost.excerpt,
    url: articleUrl,
    datePublished: new Date(currentPost.date).toISOString(),
    sectionLabel: 'Blog',
    sectionPath: '/blog',
  });

  return (
    <div className="blog-page">
      <JsonLd data={articleJsonLd} />
      <BlogHeader title={currentPost.title} headline={currentPost.excerpt} />
      <div className="blog-layout">
        <BlogSidebar
          allPostsMetadata={allPostsMetadata}
          activeSlug={currentPost.slug}
        />
        <main className="blog-main">
          <article>
            <h1 className="blog-article-title">{currentPost.title}</h1>
            <div className="blog-article-meta">
              <PostMeta date={currentPost.date} tags={currentPost.tags} />
            </div>
            <div className="blog-prose">
              <ArticleMarkdown content={currentPost.content} />
            </div>
          </article>
        </main>
        <ArticleMiniMap content={currentPost.content} />
      </div>
      <SiteFooter />
    </div>
  );
}