import Image from 'next/image';
import Link from 'next/link';
import { UserInterface } from '../../constant-types';
import useUser from '../../utils/iron/useUser';
import DividerLine from './DividerLine';

export default function Navbar({ displayNav }: { displayNav: boolean }) {
  const { user }: { user: UserInterface } = useUser();

  return (
    <nav
      className={`fixed inset-0 z-10 top-20 bg-dark-blue overflow-hidden transition duration-300 ${
        displayNav ? 'w-full' : 'w-0'
      }`}
      style={{ minHeight: 'calc(100vh - 5rem)' }}
    >
      <ul className='w-full p-6 grid gap-3'>
        <li className='font-semibold'>Tickets</li>
        <NavItem text='Music' href='/events/music' icon='/icons/music.svg' />
        <NavItem
          text='Festival'
          href='/events/festival'
          icon='/icons/festival.svg'
        />
        <NavItem
          text='Theatre'
          href='/events/theatre'
          icon='/icons/theatre.svg'
        />
        <NavItem text='Sport' href='/events/sport' icon='/icons/sport.svg' />
        <NavItem text='Comedy' href='/events/comedy' icon='/icons/comedy.svg' />
        <DividerLine className='py-2' />
        {user && (
          <>
            <li className='font-semibold'>My Profile</li>
            <NavItem
              text='Dashboard'
              href='/user/profile'
              icon='/icons/dashboard.svg'
            />
            <NavItem text='My Tickets' href='' icon='/icons/tickets.svg' />
            <NavItem
              text='Saved Events'
              href='/user/events/saved'
              icon='/icons/saved.svg'
            />
            <NavItem
              text='My Details'
              href='/user/profile/update'
              icon='/icons/details.svg'
            />
            <DividerLine className='py-2' />
            {user.role === 'ADMIN' && (
              <>
                <li className='font-semibold'>Creator Tools</li>
                <NavItem
                  text='Create Event'
                  href='/user/events/create'
                  icon='/icons/create-event.svg'
                  className='bg-gold hover:bg-gold-med focus:bg-gold-med active:bg-gold-dark ring-gold/40'
                />
                <NavItem
                  text='My Events'
                  href='/user/events/my-events'
                  icon='/icons/my-event.svg'
                  className='bg-light-blue hover:bg-light-blue-med focus:bg-light-blue-med active:bg-light-blue-dark ring-light-blue/40'
                />
                <DividerLine className='py-2' />
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}

type NavItemProps = {
  href: string;
  text: string;
  icon: string;
  className?: string;
};

export function NavItem({ href, text, icon, className }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={`py-3 px-5 rounded shadow-md flex gap-4 items-center focus:outline-none ring-offset-2 focus:ring-2 active:ring-2 ring-offset-mid-blue ${
          className
            ? className
            : 'bg-mid-blue hover:bg-light-blue-med focus:bg-light-blue-med active:bg-light-blue-dark ring-light-blue/40'
        }`}
      >
        <span className='h-6 w-6 relative'>
          <Image className='object-contain' src={icon} fill alt='' />
        </span>
        <span>{text}</span>
        <span className='flex items-center justify-center ml-auto'>
          <ChevronIcon />
        </span>
      </Link>
    </li>
  );
}

export function ChevronIcon() {
  return (
    <svg
      width='8'
      height='12'
      viewBox='0 0 8 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M6.79422 6.84756C7.25907 6.37901 7.25907 5.61807 6.79422 5.14952L2.03418 0.35152C1.69205 0.00666394 1.18257 -0.0945439 0.736319 0.0928779C0.290065 0.2803 0 0.715118 0 1.20241V10.7984C0 11.282 0.290065 11.7205 0.736319 11.908C1.18257 12.0954 1.69205 11.9904 2.03418 11.6493L6.79422 6.85131V6.84756Z'
        fill='#fff'
      />
    </svg>
  );
}
