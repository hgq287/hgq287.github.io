import { Metadata } from 'next';
import Link from 'next/link';

import { PostRepository } from '../../../data/post.repository';
import ArticleMarkdown from '../../components/ArticleMarkdown';
import ArticleMiniMap from '../../components/ArticleMiniMap';
import BlogSidebar from '../../components/BlogSidebar';

import styles from '../../../styles/blog.module.css';

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-10 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Page not found.</p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium transition-colors underline">
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  const allPostsMetadata = await PostRepository.getAllPostsMetadata();

  return (
    <div className={styles.blogLayout}>
      <aside className={styles.sidebarWrapper}>
        <BlogSidebar 
          allPostsMetadata={allPostsMetadata} 
          activeSlug={currentPost.slug} 
        />
      </aside>

      <main className={styles.mainContent}>
        <article>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            {currentPost.title}
          </h1>
          <p className="text-sm text-gray-500 mb-10 border-b pb-4">
            {new Date(currentPost.date).toLocaleDateString('vi-VN')} | Tags: {currentPost.tags.join(', ')}
          </p>
          
          <ArticleMarkdown content={currentPost.content} />
        </article>
      </main>

      <aside className={styles.minimapWrapper}>
        <ArticleMiniMap content={currentPost.content} />
      </aside>
      
    </div>
  );
}