import AnimatedSection from './AnimatedSection'

function Divider() {
  return (
    <div style={{ 
      width: '100%', 
      textAlign: 'center', 
      margin: '2rem 0' 
    }}>
      <hr style={{ 
        border: 'none', 
        borderTop: '1px solid #ddd', 
        width: '80%', 
        margin: '0 auto' 
      }} />
    </div>
  );
}

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
      <Divider />
    </AnimatedSection>
  )
}