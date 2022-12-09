import Link from 'next/link';
import Arrow from '../icons/arrow';

interface Props {
  text: string;
  href: string;
  colour?: 'gold' | 'mid-blue' | 'light-blue';
  className?: string;
}

export default function DashboardLink({
  text,
  href,
  colour,
  className,
}: Props) {
  const goldClass =
    'bg-gold hover:bg-gold2 focus:bg-gold2 active:bg-gold3 ring-gold';
  const midBlueClass =
    'bg-mid-blue hover:bg-mid-blue2 focus:bg-mid-blue2 active:bg-mid-blue3 ring-mid-blue';
  const lightBlueClass =
    'bg-light-blue hover:bg-light-blue2 focus:bg-light-blue2 active:bg-light-blue3 ring-light-blue';

  return (
    <Link
      href={href}
      className={`font-title transition duration-200 rounded-md flex items-center justify-between gap-4 p-8 shadow-lg md:text-xl focus:outline-none ring-offset-2 focus:ring-2 ${
        colour === 'gold' && goldClass
      }
      ${colour === 'mid-blue' && midBlueClass}
      ${colour === 'light-blue' && lightBlueClass} ${className}`}
    >
      <span>{text}</span>
      <Arrow />
    </Link>
  );
}
