import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import SessionWrapper from '@/components/auth/SessionWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata = {
  title: 'Real Estate Search',
  description: 'Search and find the perfect property to rent or buy',
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link 
          rel="preload" 
          href="/icons/favicon.ico" 
          as="image" 
          type="image/x-icon"
        />
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          <Navbar />
          <main>{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
