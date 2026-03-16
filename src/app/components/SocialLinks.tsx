import { SiGithub, SiLinkedin, SiStackoverflow, SiX } from 'react-icons/si';

export const SocialLinks = () => (
  <div className="flex items-center gap-2.5">
    <a 
      href="https://github.com/hgq287" 
      target='_blank' 
      rel="noopener noreferrer" 
      className="text-slate-600 dark:text-slate-400 transition-all duration-200 flex hover:text-slate-900 dark:hover:text-slate-100 hover:-translate-y-0.5"
      aria-label="GitHub"
    >
      <SiGithub size={16} />
    </a>
    <a 
      href="https://www.linkedin.com/in/hgq287" 
      target='_blank' 
      rel="noopener noreferrer" 
      className="text-slate-600 dark:text-slate-400 transition-all duration-200 flex hover:text-slate-900 dark:hover:text-slate-100 hover:-translate-y-0.5"
      aria-label="LinkedIn"
    >
      <SiLinkedin size={16} />
    </a>
    <a 
      href="https://stackoverflow.com/users/12345813/hgq287" 
      target='_blank' 
      rel="noopener noreferrer" 
      className="text-slate-600 dark:text-slate-400 transition-all duration-200 flex hover:text-slate-900 dark:hover:text-slate-100 hover:-translate-y-0.5"
      aria-label="Stack Overflow"
    >
      <SiStackoverflow size={16} />
    </a>
  </div>
);