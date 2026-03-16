import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer>
      <div className="home-links">
        <a href="/feed.xml" target="_blank" rel="noopener noreferrer">
          ↗ rss
        </a>
        <span className="home-links-sep">/</span>
        <a href="https://github.com/hgq287" target="_blank" rel="noopener noreferrer">
          ↗ github
        </a>
        <span className="home-links-sep">/</span>
        <a href="https://github.com/hgq287/hgq287.github.io" target="_blank" rel="noopener noreferrer">
          ↗ view source
        </a>
      </div>
      <div className="home-footer-second-row">
        <span className="home-footer-copy">
          © {new Date().getFullYear()} MIT Licensed
        </span>
        <span className="home-footer-sep">/</span>
        <a href="/Resume.pdf" download="Resume.pdf" className="home-resume-link">
          Resume
        </a>
      </div>
    </footer>
  );
}

