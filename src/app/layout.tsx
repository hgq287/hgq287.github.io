import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Hg Q. - Portfolio & Profiles',
  description: 'A Full-Stack Software Engineer and Solutions Architect'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}