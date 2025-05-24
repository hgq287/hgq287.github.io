import MarkdownSection from './components/MarkdownSection';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';

export default async function Home() {
  const dataDir = path.join(process.cwd(), 'public/data');

  const files = ['about.md', 'skills.md', 'projects.md', 'contact.md'];

  const sections = await Promise.all(
    files.map(async (filename) => {
      const raw = await fs.readFile(path.join(dataDir, filename), 'utf-8');
      const html = await marked.parse(raw); // ✅ fixed here
      return {
        title: filename.replace('.md', '').toUpperCase(),
        contentHtml: html,
      };
    })
  );

  return (
    <>
      <h1>👋 Welcome to My Portfolio</h1>
      {sections.map(({ title, contentHtml }) => (
        <MarkdownSection key={title} title={title} contentHtml={contentHtml} />
      ))}
    </>
  );
}