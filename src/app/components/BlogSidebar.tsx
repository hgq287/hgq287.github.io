"use client";
import Link from 'next/link';
import { PostMetadata } from '../../types/post.types';

interface BlogSidebarProps {
  allPostsMetadata: PostMetadata[];
  activeSlug: string; 
}

const linkBaseStyle = {
    display: 'block',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'all 0.15s ease-in-out',
    fontSize: '14px',
    lineHeight: '1.4',
};

export default function BlogSidebar({ allPostsMetadata, activeSlug }: BlogSidebarProps) {
  return (
    <div style={{ fontFamily: 'inherit' }}>
      <h3 style={{ fontSize: '1.2rem', margin: '1.5em 0 0.5em', fontWeight: 400 }}>
        All Posts
      </h3>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {allPostsMetadata.map(post => {
            const isActive = post.slug === activeSlug;
            const linkStyle = {
                ...linkBaseStyle,
                backgroundColor: 'transparent', 
                color: isActive ? '#4051b5' : '#000000de', 
                fontWeight: isActive ? '550' : '400',
            };
        
            return (
              <li key={post.slug}>
                <Link 
                  href={`/blog/${post.slug}`} 
                  style={linkStyle}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#526cfe'; 
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = (!isActive) ? '#000000de' : '#4051b5';
                  }}
                >
                  <div style={{ lineHeight: 1.4, fontWeight: 'inherit' }}>{post.title}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}