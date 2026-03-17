import BlogHeader from '../../components/BlogHeader';
import { Metadata } from 'next';
import Link from 'next/link';
import { SystemsRepository } from '../../../data/systems.repository';
import ArticleMarkdown from '../../components/ArticleMarkdown';
import ArticleMiniMap from '../../components/ArticleMiniMap';
import BlogSidebar from '../../components/BlogSidebar';
import PostMeta from '../../components/PostMeta';
import SiteFooter from '../../components/SiteFooter';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const list = await SystemsRepository.getAllPostsMetadata();
  return list.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await SystemsRepository.getPostBySlug(params.slug);
  if (!post) return { title: "Article not found | Hg's Portfolio" };
  return {
    title: `${post.title} | Hg's Portfolio`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
  };
}

export default async function SystemsPostPage({ params }: PageProps) {
  const { slug } = await params;
  const currentPost = await SystemsRepository.getPostBySlug(slug);

  if (!currentPost) {
    return (
      <div className="blog-page">
        <BlogHeader title="Systems" headline="Article not found" />
        <div className="blog-layout">
          <main className="blog-main">
            <h1 className="blog-article-title">404</h1>
            <p className="blog-prose" style={{ marginTop: '1rem' }}>Page not found.</p>
            <Link href="/systems" className="blog-prose" style={{ marginTop: '1rem', display: 'inline-block' }}>
              &larr; Back to Systems
            </Link>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const allMetadata = await SystemsRepository.getAllPostsMetadata();

  return (
    <div className="blog-page">
      <BlogHeader title={currentPost.title} headline={currentPost.excerpt} />
      <div className="blog-layout">
        <BlogSidebar
          allPostsMetadata={allMetadata}
          activeSlug={currentPost.slug}
          basePath="/systems"
          sidebarTitle="All Articles"
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
