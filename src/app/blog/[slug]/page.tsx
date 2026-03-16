import BlogHeader from '../../components/BlogHeader';
import { Metadata } from 'next';
import Link from 'next/link';

import { PostRepository } from '../../../data/post.repository';

import ArticleMarkdown from '../../components/ArticleMarkdown';
import ArticleMiniMap from '../../components/ArticleMiniMap';
import BlogSidebar from '../../components/BlogSidebar';
import PostMeta from '../../components/PostMeta';
import SiteFooter from '../../components/SiteFooter';

interface PostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await PostRepository.getAllPostsMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await PostRepository.getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post not found | Hg's Portfolio" };
  }

  return {
    title: `${post.title} | Hg's Portfolio`, 
    description: post.excerpt, 
    keywords: post.tags.join(', '),
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const safeParams = await params;
  const { slug } = safeParams;
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

  return (
    <div className="blog-page">
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