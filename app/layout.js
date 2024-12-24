import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import SessionWrapper from '@/components/auth/SessionWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata = {
  title: 'Real Estate Search',
  description: 'Search and find the perfect property to rent or buy',
  icons: {
    icon: [
      { url: '/icons/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/favicon.ico',
    // apple: '/icons/apple-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <SessionWrapper>
          <Navbar />
          <main>{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
