import Link from 'next/link';
import './globals.css';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Real Estate Search
        </h1>
        <p className="text-center text-xl">
          Find your perfect property today
        </p>
      </div>
    </main>
  );
}
