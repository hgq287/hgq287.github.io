import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PostRepository } from '../../data/post.repository';
import { blogIndexMetadata } from '../../lib/site-config';
import TaggedSectionView from '../components/TaggedSectionView';

export const metadata: Metadata = blogIndexMetadata;

export default async function BlogHomePage() {
  const posts = await PostRepository.getAllPosts();

  return (
    <Suspense fallback={null}>
      <TaggedSectionView
        posts={posts}
        basePath="/blog"
        sectionTitle="Blog"
        sidebarTitle="All Posts"
        emptyLabel="posts"
      />
    </Suspense>
  );
}
