import Link from 'next/link';

interface Props {
  displayNav: boolean;
}

export default function Nav({ displayNav }: Props) {
  return (
    <nav
      className={`absolute top-0 left-0 w-full h-screen bg-mid-blue ${
        displayNav ? 'block' : 'hidden'
      } lg:block lg:relative lg:h-auto lg:w-auto lg:bg-transparent`}
    >
      <ul className='flex flex-col justify-center h-full w-full gap-4 p-8 lg:flex-row lg:p-0 lg:ml-4 lg:text-lg xl:text-xl'>
        <li>
          <Link href='/'>Music</Link>
        </li>
        <li>
          <Link href='/'>Festivals</Link>
        </li>
        <li>
          <Link href='/'>Theatre</Link>
        </li>
        <li>
          <Link href='/'>Sport</Link>
        </li>
        <li>
          <Link href='/'>Comedy</Link>
        </li>
      </ul>
    </nav>
  );
}
