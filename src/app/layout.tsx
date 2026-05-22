import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';

import { Toaster } from '@/src/components/ui/sonner';

import { DATA } from '../constant/data.constant';
import { cn } from '../lib/utils';
import './globals.css';

const poppins = Poppins({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const histeagin = localFont({
  variable: '--font-mono',
  src: './_fonts/histeagin.ttf',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bagusfitri-undangan.online'),
  title: DATA.APP_TITLE,
  description: DATA.APP_DESCRIPTION,
  openGraph: {
    title: DATA.APP_TITLE,
    description: DATA.APP_DESCRIPTION,
    images: [
      {
        url: '/images/meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Foto Bagus & Fitri',
      },
    ],
    type: 'website',
    locale: 'id_ID',
    siteName: DATA.APP_TITLE,
  },
  twitter: {
    card: 'summary_large_image',
    title: DATA.APP_TITLE,
    description: DATA.APP_DESCRIPTION,
    images: ['/images/meta.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-sans', poppins.variable)}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${poppins.variable} ${histeagin.variable} antialiased w-full h-full bg-[#2C4037]`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
