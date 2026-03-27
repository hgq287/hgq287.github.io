import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Source_Sans_3, Source_Serif_4 } from 'next/font/google';
import type { Metadata } from 'next';

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

const siteTitle = "Hung Quang Truong – Application Engineer & Systems Architect";
const siteDescription =
  'Engineering systems with 15+ years in software development and 9+ years Native Swift. Specialist in internal SDK architecture, mobile/core engines, and full-stack systems.';

export const metadata: Metadata = {
  metadataBase: new URL('https://hgq287.github.io'),
  title: {
    default: siteTitle,
    template: "%s | Hg's Portfolio",
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: "Hg's Portfolio",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="data-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}