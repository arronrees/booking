import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState } from 'react';
import Nav from './Nav';
import SearchForm from './SearchForm';
import Toolbar from './Toolbar';

export default function Header() {
  const [displayNav, setDisplayNav] = useState(false);

  return (
    <>
      <Toolbar />
      <header className='p-4 md:p-8 flex gap-4 items-center lg:items-end'>
        <Link
          href='/'
          className='text-3xl font-title text-gold md:text-4xl lg:text-6xl'
        >
          YourTicket
        </Link>
        <Nav displayNav={displayNav} />
        <SearchForm />
        <button
          type='button'
          className='cursor-pointer relative z-50 lg:hidden ml-auto xs:ml-0'
          onClick={() => setDisplayNav(!displayNav)}
        >
          <Bars3Icon className='w-6 h-6' />
        </button>
      </header>
    </>
  );
}
