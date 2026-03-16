'use client';

import { extractHeadingsFromMarkdown } from '../../infra/markdown/extractHeadings';

interface ArticleMiniMapProps {
  content: string;
}

export default function ArticleMiniMap({ content }: ArticleMiniMapProps) {
  const headings = extractHeadingsFromMarkdown(content);

  if (headings.length === 0) return null;

  return (
    <aside className="blog-minimap-wrap">
      <h3 className="blog-minimap-title">On this page</h3>
      <nav aria-label="Table of contents">
        <ul className="blog-minimap-list">
          {headings.map((heading, index) => (
            <li key={index} data-level={heading.level}>
              <a href={`#${heading.slug}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
