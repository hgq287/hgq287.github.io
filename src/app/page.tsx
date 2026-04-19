import MainHeader from './components/MainHeader';
import Link from 'next/link';
import { getHomeFeed } from '../data/home-feed';
import { IntroRepository } from '../data/intro.repository';
import SiteFooter from './components/SiteFooter';

const EXCERPT_MAX = 200;

function truncateExcerpt(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export default async function Home() {
  const intro = IntroRepository.getIntro();
  const feed = await getHomeFeed(3);

  return (
    <>
      <MainHeader minimal />
      <main className="home-page">
        <article>
          <h1 className="home-title">
            {intro?.title ?? 'My Portfolio'}
          </h1>
          {intro?.intro && (
            <div className="home-intro">
              {intro.intro
                .split(/\n\n+/)
                .filter((s) => s.trim())
                .map((paragraph, i) => (
                  <p key={i}>{paragraph.trim()}</p>
                ))}
            </div>
          )}

          <div className="home-writing">
            <h2 className="home-writing-title">Recent writing</h2>
            <p className="home-writing-lede">
              Systems blueprints and blog posts (newest and featured first).{' '}
              <Link href="/systems">All Systems</Link>
              {' · '}
              <Link href="/blog">All Blog</Link>
            </p>

            <ul className="home-posts">
              {feed.length === 0 ? (
                <li className="text-sm">No posts yet.</li>
              ) : (
                feed.map((post) => (
                  <li key={`${post.source}-${post.slug}`} className="home-post-item">
                    <div className="home-post-meta">
                      <span className="home-post-date">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className={`home-post-source home-post-source--${post.source}`}>
                        {post.source === 'systems' ? 'Systems' : 'Blog'}
                      </span>
                    </div>
                    <Link href={post.href} className="home-post-link">
                      {post.title}
                    </Link>
                    {post.excerpt ? (
                      <p className="home-post-excerpt">{truncateExcerpt(post.excerpt, EXCERPT_MAX)}</p>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </div>
        </article>

        <SiteFooter />
      </main>
    </>
  );
}
