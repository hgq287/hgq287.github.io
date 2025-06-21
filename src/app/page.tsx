import Header from './components/Header';
import MarkdownSection from './components/MarkdownSection';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';

export default async function Home() {
  const dataDir = path.join(process.cwd(), 'public/data');

  const files = [
    {'filename': 'about.md', 'title': 'a Solutions Architect with over 10+ years of full-stack experience'}, 
    {'filename': 'education.md', 'title': 'Education'}, 
    {'filename': 'experience.md', 'title': 'Experience'},
    {'filename': 'skills.md', 'title': 'Technical Skills'}, 
    {'filename':'projects.md', 'title': 'projects'}, 
    {'filename':'contact.md', 'title': 'Contact'}
  ];

  const sections = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(dataDir, file.filename), 'utf-8');
      const html = await marked.parse(raw);
      return {
        title: file.title,
        contentHtml: html,
      };
    })
  );

  return (
    <>
      <Header />
      <main className="main-content">
        {sections.map(({ title, contentHtml }) => (
          <MarkdownSection key={title} title={title} contentHtml={contentHtml} />
        ))}
      </main>
    </>
  );
}