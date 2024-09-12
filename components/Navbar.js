// import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'D&D Monster App',
  description: 'Explore and create D&D monsters',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
