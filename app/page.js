import Link from 'next/link';
import './globals.css';

export default function Home() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold text-center mb-4'>
        Welcome to D&D Monster App
      </h1>
      <p className='text-center text-gray-600'>
        Explore and create D&D monsters
      </p>
      <Link href='/monsters'>To monsters</Link>
    </div>
  );
}
