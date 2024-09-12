import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getMonster(id) {
  const res = await fetch(`http://localhost:3000/api/monsters/${id}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch monster');
  }
  return res.json();
}

export default async function MonsterDetail({ params }) {
  const monster = await getMonster(params.id);

  if (!monster) {
    notFound();
  }

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        {monster.name}
      </h1>
      {/* Rest of your monster detail JSX */}
      <Link href='/monsters' className='btn mt-8 inline-block'>
        Back to Monster List
      </Link>
    </div>
  );
}
