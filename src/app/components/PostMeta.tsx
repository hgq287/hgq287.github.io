'use client';

export default function PostMeta({ date, tags }: { date: string; tags: string[] }) {
  return (
    <div className="flex items-center gap-3 mb-8 text-text-secondary text-sm flex-wrap">
      <time dateTime={date} className="font-medium">
        {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      {tags.length > 0 && (
        <div className="post-meta-tags flex flex-wrap items-center">
            {tags.map((tag) => (
              <a
                key={tag}
                href={`/blog?tag=${tag}`}
                className="post-meta-tag bg-accent-fg/10 text-accent-fg px-2.5 py-1 rounded-button no-underline text-xs font-medium transition-colors hover:bg-accent-fg hover:text-white"
              >
                #{tag}
              </a>
            ))}
        </div>
      )}
    </div>
  );
}