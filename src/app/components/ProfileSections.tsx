import React from 'react';

export default function MarkdownSection({
  title,
  contentHtml,
}: {
  title: string;
  contentHtml: string;
}) {
  return (
    <section>
      <h2>{title}</h2>
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <hr />
    </section>
  );
}