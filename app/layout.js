import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'D&D Monster App',
  description: 'Explore and create D&D monsters',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
