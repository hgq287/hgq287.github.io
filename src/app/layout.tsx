import './globals.css';

export const metadata = {
  title: 'hgq287 - Profile',
  description: 'Full-Stack Software Engineer Portfolio',
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