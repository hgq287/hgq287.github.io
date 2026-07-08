import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SystemsRepository } from '../../data/systems.repository';
import { systemsIndexMetadata } from '../../lib/site-config';
import TaggedSectionView from '../components/TaggedSectionView';

export const metadata: Metadata = systemsIndexMetadata;

export default async function SystemsHomePage() {
  const posts = await SystemsRepository.getAllPosts();

  return (
    <Suspense fallback={null}>
      <TaggedSectionView
        posts={posts}
        basePath="/systems"
        sectionTitle="Systems"
        sidebarTitle="All Articles"
        emptyLabel="articles"
      />
    </Suspense>
  );
}
