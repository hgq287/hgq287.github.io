import MainHeader from './components/MainHeader';
import Link from 'next/link';
import { PostRepository } from '../data/post.repository';
import { IntroRepository } from '../data/intro.repository';
import SiteFooter from './components/SiteFooter';

const RECENT_POSTS_COUNT = 5;

export default async function Home() {
  const intro = IntroRepository.getIntro();
  const allPosts = await PostRepository.getAllPostsMetadata();
  const recentPosts = allPosts.slice(0, RECENT_POSTS_COUNT);

  return (
    <>
      <MainHeader minimal />
      <main className="home-page">
        <article>
          <h1 className="home-title">
            {intro?.title ?? 'My Portfolio'}
          </h1>
          {intro?.intro && (
            <p className="home-intro">
              {intro.intro}
            </p>
          )}

          <ul className="home-posts">
            {recentPosts.length === 0 ? (
              <li className="text-sm">No posts yet.</li>
            ) : (
              recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {' '}
                    {post.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </article>

        <SiteFooter />
      </main>
    </>
  );
}
