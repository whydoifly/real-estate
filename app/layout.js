import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'D&D Monster App',
  description: 'Explore and create D&D monsters',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen bg-gray-800'>
        <Navbar />
        <main className='flex-grow overflow-auto'>{children}</main>
      </body>
    </html>
  );
}
