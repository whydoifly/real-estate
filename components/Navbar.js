import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='bg-gray-900 text-white shadow-lg'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          <Link
            href='/'
            className='text-2xl font-bold text-red-600 hover:text-red-500 transition duration-300'>
            D&D Monster Codex
          </Link>
          <ul className='flex space-x-6'>
            <li>
              <Link
                href='/monsters'
                className='hover:text-red-500 transition duration-300'>
                Monsters
              </Link>
            </li>
            <li>
              <Link
                href='/about'
                className='hover:text-red-500 transition duration-300'>
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
