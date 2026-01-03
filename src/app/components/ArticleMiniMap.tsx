"use client";
import { extractHeadingsFromMarkdown } from '../../utils/markdown.util';

interface ArticleMiniMapProps {
  content: string; 
}

export default function ArticleMiniMap({ content }: ArticleMiniMapProps) {
  const headings = extractHeadingsFromMarkdown(content);

  if (headings.length === 0) return null;

  return (
    <nav style={{ padding: '8px 0', fontSize: '14px' }}>
      <h3 style={{ fontSize: '1.2rem', margin: '1.5em 0 0.5em', fontWeight: 400 }}>
        Table of Contents
      </h3>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {headings.map((heading, index) => {
          const isH3 = heading.level === 3;
          const isH4 = heading.level === 4;
          
          return (
            <li 
              key={index} 
              style={{
                marginBottom: '8px',
                marginLeft: isH3 ? '16px' : (isH4 ? '32px' : '0px'),
              }}
            >
              <a 
                href={`#${heading.slug}`} 
                style={{
                  color: isH3 || isH4 ? '#6b7280' : '#4a5568', 
                  textDecoration: 'none',
                  transition: 'color 0.15s ease-in-out',
                  display: 'block',
                  lineHeight: '1.4',
                  fontWeight: isH3 || isH4 ? '400' : '500', 
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#526cfe'} 
                onMouseOut={(e) => e.currentTarget.style.color = isH3 || isH4 ? '#6b7280' : '#4a5568'}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}