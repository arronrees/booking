import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';

export default function Toolbar() {
  const router = useRouter();

  return (
    <div className='py-3 px-4 bg-mid-blue flex items-center gap-4'>
      <button
        onClick={async () => {
          const res = await fetch('/api/auth/signout', { method: 'POST' });
          if (res.ok) router.push('/');
        }}
      >
        Sign Out
      </button>
      <span className='bg-white w-[2px] h-6 ml-auto '></span>
      <Link href='/user/profile' className='flex items-center gap-4'>
        <span>My Account</span>
        <span>
          <UserIcon className='w-6 h-6' />
        </span>
      </Link>
    </div>
  );
}
