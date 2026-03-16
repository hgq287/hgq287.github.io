import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        'background-elevated': 'var(--color-bg-elevated)',
        foreground: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        divider: 'var(--color-divider)',
        accent: 'var(--color-accent)',
        'accent-fg': 'var(--accent-fg-color)',
        'accent-fg-hover': 'var(--accent-fg-hover)',
        'btn-bg': 'var(--btn-bg)',
        'btn-border': 'var(--btn-border)',
        'tag-line': 'var(--tag-line)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: [
          'var(--font-mono)',
          'SFMono-Regular',
          'Consolas',
          'Liberation Mono',
          'Menlo',
          'monospace',
        ],
      },
      maxWidth: {
        'container': '1200px',
        'prose': '720px',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.06)',
        'soft-dark': '0 2px 12px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
