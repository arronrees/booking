import Link from 'next/link';
import Arrow from '../icons/arrow';

interface Props {
  text: string;
  href: string;
  colour?: 'gold' | 'dark-blue' | 'light-blue';
  className?: string;
}

export default function DashboardLink({
  text,
  href,
  colour,
  className,
}: Props) {
  const goldClass =
    'bg-gold hover:bg-gold-med focus:bg-gold-med active:bg-gold-dark ring-gold';
  const darkBlueClass =
    'bg-dark-blue hover:bg-dark-blue2 focus:bg-dark-blue2 active:bg-dark-blue3 ring-dark-blue';
  const lightBlueClass =
    'bg-light-blue hover:bg-light-blue-med focus:bg-light-blue-med active:bg-light-blue-dark ring-light-blue';

  return (
    <Link
      href={href}
      className={`font-title transition duration-200 rounded-md flex items-center justify-between gap-4 p-8 shadow-lg md:text-xl focus:outline-none ring-offset-2 focus:ring-2 ${
        colour === 'gold' && goldClass
      }
      ${colour === 'dark-blue' && darkBlueClass}
      ${colour === 'light-blue' && lightBlueClass} ${className}`}
    >
      <span>{text}</span>
      <Arrow />
    </Link>
  );
}
