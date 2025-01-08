'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileEditor from '@/components/user/ProfileEditor';

export default function Dashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleProfileUpdate = async (updatedData) => {
    // Update the session with new user data
    await update({
      ...session,
      user: {
        ...session.user,
        ...updatedData,
      },
    });
  };

  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        Личный кабинет
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Profile Editor Section */}
        <div>
          <ProfileEditor user={session.user} onUpdate={handleProfileUpdate} />
        </div>

        {/* Quick Links Section */}
        <div className='bg-gray-700 p-6 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold mb-6 text-red-500'>
            Быстрые ссылки
          </h2>
          <div className='space-y-4'>
            <Link
              href='/properties'
              className='block bg-gray-600 p-4 rounded hover:bg-gray-500 transition duration-300'>
              Посмотреть объекты
            </Link>

            {session.user.role === 'admin' && (
              <>
                <Link
                  href='/admin/users'
                  className='block bg-gray-600 p-4 rounded hover:bg-gray-500 transition duration-300'>
                  Управление пользователями
                </Link>
                <Link
                  href='/admin/properties/create'
                  className='block bg-gray-600 p-4 rounded hover:bg-gray-500 transition duration-300'>
                  Создать объект
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
