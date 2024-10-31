import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import SessionWrapper from '@/components/SessionWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Real Estate Search',
  description: 'Search and find the perfect property to rent or buy',
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
