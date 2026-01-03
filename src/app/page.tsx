import Header from './components/Header';
import MarkdownSection from './components/MarkdownSection';
import Copyright from './components/Copyright';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';

import portfolioStyles from '../styles/Portfolio.module.css';

export default async function Home() {
  const dataDir = path.join(process.cwd(), 'public/content');

  const files = [
    {'filename': 'about.mdx', 'title': 'a Solutions Architect with over 10+ years of full-stack experience'}, 
    {'filename': 'education.mdx', 'title': 'Education'}, 
    {'filename': 'experience.mdx', 'title': 'Experience'},
    {'filename': 'skills.mdx', 'title': 'Technical Skills'}, 
    {'filename':'projects.mdx', 'title': 'projects'},
    {'filename':'hobbies.mdx', 'title': 'hobbies'},  
    {'filename':'contact.mdx', 'title': 'Contact'}
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
      <main className={portfolioStyles.portfolio}>
        {sections.map(({ title, contentHtml }) => (
          <MarkdownSection key={title} title={title} contentHtml={contentHtml} />
        ))}
        <Copyright />
      </main>
    </>
  );
}