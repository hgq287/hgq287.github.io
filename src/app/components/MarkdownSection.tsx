import AnimatedSection from './AnimatedSection'

function Divider() {
  return (
    <hr className="border-0 border-t border-divider my-8 w-full max-w-[80%] mx-auto" />
  );
}

export default function MarkdownSection({
  title,
  contentHtml,
  skipFirstHeading = false,
}: {
  title: string;
  contentHtml: string;
  skipFirstHeading?: boolean;
}) {
  return (
    <AnimatedSection>
      <article
        className={`prose prose-neutral dark:prose-invert max-w-none
          prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:leading-relaxed prose-p:text-text-secondary prose-p:dark:text-zinc-300
          prose-strong:font-semibold prose-strong:text-foreground
          prose-li:mb-1.5 prose-li:text-text-secondary prose-li:dark:text-zinc-300
          prose-a:text-accent-fg prose-a:no-underline hover:prose-a:underline prose-a:decoration-accent-fg/40 prose-a:underline-offset-2
          prose-h2:mt-10 prose-h2:mb-4 prose-h2:pt-2 prose-h2:border-t prose-h2:border-divider
          prose-h3:mt-6 prose-h3:mb-3
          ${skipFirstHeading ? 'prose-skip-first-heading' : ''}`}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <Divider />
    </AnimatedSection>
  )
}