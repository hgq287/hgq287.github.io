import AnimatedSection from './AnimatedSection'

export default function MarkdownSection({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title,
  contentHtml,
}: {
  title: string;
  contentHtml: string;
}) {
  return (
    <AnimatedSection>
      <article
        className="prose prose-neutral dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <hr className="my-8 border-neutral-300 dark:border-neutral-600" />
    </AnimatedSection>
  )
}