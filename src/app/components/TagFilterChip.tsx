'use client';

import Link from 'next/link';

export default function TagFilterChip({
  tag,
  clearHref,
}: {
  tag: string;
  clearHref: string;
}) {
  return (
    <div className="tag-filter-bar" role="status" aria-live="polite">
      <span className="tag-filter-bar-label">Filtered by</span>
      <span className="post-meta-tag tag-filter-active-tag">#{tag}</span>
      <Link href={clearHref} className="tag-filter-chip-clear">
        Clear
      </Link>
    </div>
  );
}
