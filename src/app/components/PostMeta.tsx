"use client";
import styles from '../../styles/PostMeta.module.css';

export default function PostMeta({ date, tags }: { date: string, tags: string[] }) {
  return (
    <div className={styles.metaContainer}>
      <time className={styles.date}>
        📅 {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      
      <div className={styles.divider}>|</div>
      
      <div className={styles.tagsList}>
        {tags.map(tag => (
          <a key={tag} href={`/blog?tag=${tag}`} className={styles.tagBadge}>
            #{tag}
          </a>
        ))}
      </div>
    </div>
  );
}