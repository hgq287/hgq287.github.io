import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Source_Sans_3, Source_Serif_4 } from 'next/font/google';

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

export const metadata = {
  title: 'Truong Quang Hung – Staff Application Engineer & Systems Architect',
  description: 'Engineering leader with 15+ years in software development and 9+ years Native Swift. Specialist in internal SDK architecture, mobile/core engines, and full-stack systems.'
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