import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const INTRO_PATH = path.join(process.cwd(), 'public/content/intro.md');

export type IntroContent = {
  title: string;
  intro: string;
};

export const IntroRepository = {
  getIntro(): IntroContent | null {
    try {
      if (!fs.existsSync(INTRO_PATH)) return null;
      const raw = fs.readFileSync(INTRO_PATH, 'utf-8');
      const { data, content } = matter(raw);
      const intro = (content || '').trim();
      return {
        title: data.title ?? 'My Portfolio',
        intro: intro || '',
      };
    } catch {
      return null;
    }
  },
};

