import { PostRepository } from '../../data/post.repository'; 

import BlogHeader from '../components/BlogHeader';
import ArticleMarkdown from '../components/ArticleMarkdown';
import ArticleMiniMap from '../components/ArticleMiniMap';
import BlogSidebar from '../components/BlogSidebar';
import PostMeta from '../components/PostMeta';
import SiteFooter from '../components/SiteFooter';

export default async function BlogHomePage() {
  const allPostsMetadata = await PostRepository.getAllPostsMetadata();
  
  if (allPostsMetadata.length === 0) {
    return (
      <div className="blog-page">
        <BlogHeader title="Blog" headline="No posts yet" />
        <div className="blog-layout">
          <main className="blog-main">
            <p className="blog-prose" style={{ marginTop: '2rem' }}>No posts to display.</p>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const latestPostSlug = allPostsMetadata[0].slug;
  const latestPost = await PostRepository.getPostBySlug(latestPostSlug);

  if (!latestPost) {
    return (
      <div className="blog-page">
        <BlogHeader title="Blog" headline="Error" />
        <div className="blog-layout">
          <main className="blog-main">
            <p className="blog-prose" style={{ marginTop: '2rem', color: '#b91c1c' }}>Latest post content not found.</p>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }
  
  return (
    <div className="blog-page">
      <BlogHeader title={latestPost.title} headline={latestPost.excerpt} />
      <div className="blog-layout">
        <BlogSidebar
          allPostsMetadata={allPostsMetadata}
          activeSlug={latestPostSlug}
        />
        <main className="blog-main">
          <article>
            <h1 className="blog-article-title">{latestPost.title}</h1>
            <div className="blog-article-meta">
              <PostMeta date={latestPost.date} tags={latestPost.tags} />
            </div>
            <div className="blog-prose">
              <ArticleMarkdown content={latestPost.content} />
            </div>
          </article>
        </main>
        <ArticleMiniMap content={latestPost.content} />
      </div>
      <SiteFooter />
    </div>
  );
}