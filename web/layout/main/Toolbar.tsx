import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';
import useUser from '../../utils/iron/useUser';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Toolbar() {
  const router = useRouter();

  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className='py-3 px-4 bg-mid-blue flex items-center gap-4'>
        <ClipLoader color='#fff' size={16} />
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

  return (
    <div className='py-3 px-4 bg-mid-blue flex items-center gap-4'>
      {user ? (
        <button
          onClick={async () => {
            const res = await fetch('/api/auth/signout', { method: 'POST' });
            if (res.ok) router.push('/');
          }}
        >
          Sign Out
        </button>
      ) : (
        <Link href='/auth/signin'>Sign In</Link>
      )}
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
