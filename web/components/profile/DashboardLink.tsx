import Link from 'next/link';
import Arrow from '../icons/arrow';

interface Props {
  text: string;
  href: string;
  colour?: string;
  className?: string;
}

export default function DashboardLink({
  text,
  href,
  colour,
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={`font-title bg-${colour ? colour : 'mid-blue'} hover:bg-${
        colour ? colour : 'mid-blue'
      }2 focus:bg-${colour ? colour : 'mid-blue'}2 active:bg-${
        colour ? colour : 'mid-blue'
      }3 transition duration-200 rounded-md flex items-center justify-between gap-4 p-8 shadow-lg md:text-xl ${className} focus:outline-none ring-offset-2 focus:ring-2 ring-${
        colour ? colour : 'mid-blue'
      }`}
    >
      <span>{text}</span>
      <Arrow />
    </Link>
  );
}
