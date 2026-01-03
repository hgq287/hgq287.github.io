import { PostRepository } from '../../data/post.repository'; 

import styles from '../../styles/Blog.module.css'; 

import BlogHeader from '../components/BlogHeader';
import ArticleMarkdown from '../components/ArticleMarkdown';
import ArticleMiniMap from '../components/ArticleMiniMap';
import BlogSidebar from '../components/BlogSidebar';
import PostMeta from '../components/PostMeta';

export default async function BlogHomePage() {
  const allPostsMetadata = await PostRepository.getAllPostsMetadata();
  
  if (allPostsMetadata.length === 0) {
    return <div className="p-10 text-center text-xl text-gray-500">Not found any posts to display.</div>;
  }

  const latestPostSlug = allPostsMetadata[0].slug;
  const latestPost = await PostRepository.getPostBySlug(latestPostSlug);

  if (!latestPost) {
      return <div className="p-10 text-center text-xl text-red-500">Latest post content not found.</div>;
  }
  
  return (
    <>
      <BlogHeader 
        title={latestPost.title} 
        headline={latestPost.excerpt} 
      />
      <div className={styles.blogLayout}> 
        <aside className={styles.sidebarWrapper}>
          <BlogSidebar 
            allPostsMetadata={allPostsMetadata} 
            activeSlug={latestPostSlug} 
          />
        </aside>

        <main className={styles.article}>
          <article>
            <h1>
              {latestPost.title}
            </h1>
            <PostMeta date={latestPost.date} tags={latestPost.tags} />
            <ArticleMarkdown content={latestPost.content} />
          </article>
        </main>

        <aside className={styles.minimapWrapper}>
          <ArticleMiniMap content={latestPost.content} />
        </aside>
      
      </div>
    </>
  );
}