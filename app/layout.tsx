import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'WriFe Resources — AI Writing Tools for Teachers',
    template: '%s | WriFe Resources',
  },
  description:
    'Nine AI-powered writing tools that give every pupil real-time, individualised ' +
    'feedback. Built for the WriFe curriculum.',
  metadataBase: new URL('https://resources.wrife.co.uk'),
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    siteName: 'WriFe Resources',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Font is loaded via Google Fonts link tag in production (add to <head> in globals.css)
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
