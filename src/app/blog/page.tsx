import ArticleMarkdown from '../components/ArticleMarkdown';
import ArticleMiniMap from '../components/ArticleMiniMap';
import BlogSidebar from '../components/BlogSidebar';
import { PostRepository } from '../../data/post.repository'; 

import styles from '../../styles/blog.module.css'; 

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
    <div className={styles.blogLayout}> 
      <aside className={styles.sidebarWrapper}>
        <BlogSidebar 
          allPostsMetadata={allPostsMetadata} 
          activeSlug={latestPostSlug} 
        />
      </aside>

      <main className={styles.mainContent}>
        <article>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            {latestPost.title}
          </h1>
          <p className="text-sm text-gray-500 mb-10 border-b pb-4">
            Đăng ngày: {new Date(latestPost.date).toLocaleDateString('vi-VN')} | Tags: {latestPost.tags.join(', ')}
          </p>
          
          <ArticleMarkdown content={latestPost.content} />
        </article>
      </main>

      <aside className={styles.minimapWrapper}>
        <ArticleMiniMap content={latestPost.content} />
      </aside>
      
    </div>
  );
}