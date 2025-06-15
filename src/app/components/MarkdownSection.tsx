export default function MarkdownSection({
  title,
  contentHtml,
}: {
  title: string;
  contentHtml: string;
}) {
  return (
    <section>
      <h3>{title}</h3>
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <hr />
    </section>
  );
}