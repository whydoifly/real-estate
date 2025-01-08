import Link from 'next/link';

export default function HomePage() {
  return (
    <main className='bg-gray-800 text-white'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-4xl font-bold text-center mb-8 text-red-600'>
          Аренда недвижимости
        </h1>
        <div className='text-center'>
          <Link
            href='/properties'
            className='inline-block bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition duration-300'>
            Посмотреть объекты
          </Link>
        </div>
      </div>
    </main>
  );
}
