import { SystemsRepository } from '../../data/systems.repository';
import BlogHeader from '../components/BlogHeader';
import ArticleMarkdown from '../components/ArticleMarkdown';
import ArticleMiniMap from '../components/ArticleMiniMap';
import BlogSidebar from '../components/BlogSidebar';
import PostMeta from '../components/PostMeta';
import SiteFooter from '../components/SiteFooter';

export default async function SystemsHomePage() {
  const allMetadata = await SystemsRepository.getAllPostsMetadata();

  if (allMetadata.length === 0) {
    return (
      <div className="blog-page">
        <BlogHeader title="Systems" headline="No articles yet" />
        <div className="blog-layout">
          <main className="blog-main">
            <p className="blog-prose" style={{ marginTop: '2rem' }}>No systems articles to display.</p>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const latestSlug = allMetadata[0].slug;
  const latestPost = await SystemsRepository.getPostBySlug(latestSlug);

  if (!latestPost) {
    return (
      <div className="blog-page">
        <BlogHeader title="Systems" headline="Error" />
        <div className="blog-layout">
          <main className="blog-main">
            <p className="blog-prose" style={{ marginTop: '2rem', color: '#b91c1c' }}>Latest article not found.</p>
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
          allPostsMetadata={allMetadata}
          activeSlug={latestSlug}
          basePath="/systems"
          sidebarTitle="All Articles"
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
