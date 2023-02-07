import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState } from 'react';
import { UserInterface } from '../../constant-types';
import useUser from '../../utils/iron/useUser';
import DividerLine from './DividerLine';

export default function Header() {
  const [displayNav, setDisplayNav] = useState(false);

  const { user }: { user: UserInterface } = useUser();

  return (
    <div className='p-6'>
      <header className='pb-4 flex gap-4 items-center justify-between'>
        <Link
          href='/'
          className='text-3xl font-title text-gold md:text-4xl lg:text-6xl'
        >
          YourTicket
        </Link>
        <div className='ml-auto'>
          {user ? (
            <Link href='/user/profile'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-400 text-dark-blue font-bold'>
                <span>{user.name[0]}</span>
              </div>
            </Link>
          ) : (
            <Link href='/auth/signin' className='btn btn--blue'>
              Sign In
            </Link>
          )}
        </div>
        <button
          type='button'
          className='cursor-pointer relative z-50 lg:hidden xs:ml-0'
          onClick={() => setDisplayNav(!displayNav)}
        >
          <Bars3Icon className='w-8 h-8' />
        </button>
      </header>
      <DividerLine />
    </div>
  );
}
