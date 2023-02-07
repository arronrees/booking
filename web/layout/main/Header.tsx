import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState } from 'react';
import DividerLine from './DividerLine';

export default function Header() {
  const [displayNav, setDisplayNav] = useState(false);

  return (
    <div className='p-6'>
      <header className='pb-4 flex gap-4 items-center justify-between'>
        <Link
          href='/'
          className='text-3xl font-title text-gold md:text-4xl lg:text-6xl'
        >
          YourTicket
        </Link>
        <button
          type='button'
          className='cursor-pointer relative z-50 lg:hidden ml-auto xs:ml-0'
          onClick={() => setDisplayNav(!displayNav)}
        >
          <Bars3Icon className='w-8 h-8' />
        </button>
      </header>
      <DividerLine />
    </div>
  );
}
