import BlogHeader from '../../components/BlogHeader';
import { Metadata } from 'next';
import Link from 'next/link';
import { OpsRepository } from '../../../data/ops.repository';
import { buildArticleJsonLd } from '../../../lib/json-ld';
import { OG_IMAGE_PATH, SITE_ORIGIN } from '../../../lib/site-config';
import ArticleMarkdown from '../../components/ArticleMarkdown';
import ArticleMiniMap from '../../components/ArticleMiniMap';
import BlogSidebar from '../../components/BlogSidebar';
import PostMeta from '../../components/PostMeta';
import SiteFooter from '../../components/SiteFooter';
import { JsonLd } from '../../components/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const list = await OpsRepository.getAllPostsMetadata();
  return list.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await OpsRepository.getPostBySlug(slug);
  if (!post) return { title: "Article not found | Hg's Portfolio" };

  const path = `/ops/${post.slug}`;
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

export default async function OpsPostPage({ params }: PageProps) {
  const { slug } = await params;
  const currentPost = await OpsRepository.getPostBySlug(slug);

  if (!currentPost) {
    return (
      <div className="blog-page">
        <BlogHeader title="Ops" headline="Article not found" />
        <div className="blog-layout">
          <main className="blog-main">
            <h1 className="blog-article-title">404</h1>
            <p className="blog-prose" style={{ marginTop: '1rem' }}>Page not found.</p>
            <Link href="/ops" className="blog-prose" style={{ marginTop: '1rem', display: 'inline-block' }}>
              &larr; Back to Ops
            </Link>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const allMetadata = await OpsRepository.getAllPostsMetadata();

  const articleUrl = `${SITE_ORIGIN}/ops/${currentPost.slug}`;
  const articleJsonLd = buildArticleJsonLd({
    headline: currentPost.title,
    description: currentPost.excerpt,
    url: articleUrl,
    datePublished: new Date(currentPost.date).toISOString(),
    sectionLabel: 'Ops',
    sectionPath: '/ops',
  });

  return (
    <div className="blog-page">
      <JsonLd data={articleJsonLd} />
      <BlogHeader title={currentPost.title} headline={currentPost.excerpt} />
      <div className="blog-layout">
        <BlogSidebar
          allPostsMetadata={allMetadata}
          activeSlug={currentPost.slug}
          basePath="/ops"
          sidebarTitle="All Articles"
          variant="desktop"
        />
        <main className="blog-main">
          <BlogSidebar
            allPostsMetadata={allMetadata}
            activeSlug={currentPost.slug}
            basePath="/ops"
            sidebarTitle="All Articles"
            variant="mobile"
          />
          <article>
            <h1 className="blog-article-title">{currentPost.title}</h1>
            <div className="blog-article-meta">
              <PostMeta date={currentPost.date} tags={currentPost.tags} tagBasePath="/ops" />
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
