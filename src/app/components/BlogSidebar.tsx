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
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: '#1a202c' }}>
        All Posts
      </h3>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {allPostsMetadata.map(post => {
            const isActive = post.slug === activeSlug;
            const linkStyle = {
                ...linkBaseStyle,
                backgroundColor: isActive ? '#3b82f6' : 'transparent', 
                color: isActive ? '#fff' : '#4a5568', 
                fontWeight: isActive ? '600' : '400',
            };
        
            return (
              <li key={post.slug}>
                <Link 
                  href={`/blog/${post.slug}`} 
                  style={linkStyle}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f0f4f8'; 
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
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