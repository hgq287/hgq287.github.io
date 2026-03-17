import React, { JSX } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import slugify from 'slugify';
import { CodeBlockWithCopy } from './CodeBlockWithCopy';

interface ArticleMarkdownProps {
  content: string;
}

const CustomHeading = ({ level, children }: { level: number; children: React.ReactNode }) => {
  const text = React.Children.toArray(children).join('');
  const id = slugify(text, { lower: true, strict: true, locale: 'vi' });
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return <Tag id={id} className="pt-20 -mt-20">{children}</Tag>;
};

function getCodeContent(children: React.ReactNode): string {
  const first = React.Children.toArray(children)[0];
  if (first && typeof first === 'object' && 'props' in first) {
    const props = (first as React.ReactElement<{ children?: React.ReactNode }>).props;
    const c = props?.children;
    return typeof c === 'string' ? c : '';
  }
  return '';
}

export default function ArticleMarkdown({ content }: ArticleMarkdownProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-strong:font-semibold prose-li:mb-1.5 prose-a:text-accent-fg prose-a:no-underline hover:prose-a:underline prose-text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node, children, ...props }) => <CustomHeading level={2} children={children} {...props} />,
          h3: ({ node, children, ...props }) => <CustomHeading level={3} children={children} {...props} />,
          h4: ({ node, children, ...props }) => <CustomHeading level={4} children={children} {...props} />,
          pre: ({ node, children }) => {
            const codeContent = getCodeContent(children);
            return (
              <CodeBlockWithCopy code={codeContent}>
                {children}
              </CodeBlockWithCopy>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}