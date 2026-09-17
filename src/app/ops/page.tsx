import { Suspense } from 'react';
import type { Metadata } from 'next';
import { OpsRepository } from '../../data/ops.repository';
import { opsIndexMetadata } from '../../lib/site-config';
import TaggedSectionView from '../components/TaggedSectionView';

export const metadata: Metadata = opsIndexMetadata;

export default async function OpsHomePage() {
  const posts = await OpsRepository.getAllPosts();

  return (
    <Suspense fallback={null}>
      <TaggedSectionView
        posts={posts}
        basePath="/ops"
        sectionTitle="Ops"
        sidebarTitle="All Articles"
        emptyLabel="articles"
      />
    </Suspense>
  );
}
