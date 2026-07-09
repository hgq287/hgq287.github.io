export default function SiteFooter() {
  return (
    <footer>
      <div className="site-footer-inner">
        <div className="home-links">
          <a href="https://stackoverflow.com/users/12345813/hgq287" target="_blank" rel="noopener noreferrer">
            ↗ stackoverflow
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
          {/* Resume download hidden: CV lives in docs/local/Resume.pdf (gitignored).
              To show again: copy Resume.pdf to public/, then uncomment below. */}
          {/* <span className="home-footer-sep">/</span>
          <a href="/Resume.pdf" download="Resume.pdf" className="home-resume-link">
            Resume
          </a> */}
        </div>
      </div>
    </footer>
  );
}
