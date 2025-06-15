import './globals.css';

export const metadata = {
  title: 'Hg Q. - Portfolio & Profiles',
  description: 'A Full-Stack Software Engineer and Solutions Architect',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}