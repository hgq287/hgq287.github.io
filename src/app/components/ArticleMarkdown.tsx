import React, { JSX } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createSlug } from '../../utils/markdown.util';

interface ArticleMarkdownProps {
  content: string;
}

const CustomHeading = ({ level, children }: { level: number; children: React.ReactNode }) => {
  const text = React.Children.toArray(children).join('');
  const id = createSlug(text); 
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return <Tag id={id} className="pt-20 -mt-20">{children}</Tag>;
};

export default function ArticleMarkdown({ content }: ArticleMarkdownProps) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node, children, ...props }) => <CustomHeading level={2} children={children} {...props} />,
          h3: ({ node, children, ...props }) => <CustomHeading level={3} children={children} {...props} />,
          h4: ({ node, children, ...props }) => <CustomHeading level={4} children={children} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}