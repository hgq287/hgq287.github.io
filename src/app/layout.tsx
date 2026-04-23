import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Source_Sans_3, Source_Serif_4 } from 'next/font/google';
import type { Metadata } from 'next';
import { JsonLd } from './components/JsonLd';
import { buildPersonAndWebsiteJsonLd } from '../lib/json-ld';
import { rootMetadata } from '../lib/site-config';

const fontSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body className="font-sans antialiased">
        <JsonLd data={buildPersonAndWebsiteJsonLd()} />
        <ThemeProvider attribute="data-theme">{children}</ThemeProvider>
      </body>
    </html>
  );
}
