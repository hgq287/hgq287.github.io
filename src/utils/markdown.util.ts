import slugify from 'slugify';
import { TableOfContentsItem } from '../types/post.types';

export const createSlug = (text: string): string => {
    return slugify(text, { 
        lower: true, 
        strict: true, 
        locale: 'vi', 
    });
};

export function extractHeadingsFromMarkdown(markdownContent: string): TableOfContentsItem[] {
    const headingRegex = /^(#{2,4})\s+(.*)$/gm; 
    const headings: TableOfContentsItem[] = [];
    let match;

    while ((match = headingRegex.exec(markdownContent)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const slug = createSlug(text); 
        headings.push({ text, slug, level });
    }

    return headings;
}