import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { UserInterface } from '../../constant-types';
import DividerLine from '../../layout/main/DividerLine';
import Header from '../../layout/main/Header';
import { withSessionSsr } from '../../utils/iron/withSession';

type Props = {
  user: UserInterface;
};

export default function BecomeAnAdmin({ user }: Props) {
  const router = useRouter();

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin-request`,
      { method: 'POST', headers: { Authorization: `Bearer ${user.token}` } }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
      return;
    }

    const response = await fetch('/api/user/update');

    toast.success(
      'Admin request successfully sent, we will email you with an update.'
    );
    router.push('/user');
    return;
  };

  return (
    <>
      <Header />

      <section className='px-6'>
        <div>
          <h1 className='page__title'>Become an admin</h1>
          <p>
            Your account is currently not an admin status. If you would like to
            become an admin to start creating events, please click below to
            request admin verification.
          </p>
        </div>
        <DividerLine className='py-4' />
        <div>
          <button className='btn btn--blue' onClick={handleButtonClick}>
            Request admin account
          </button>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res, params }) {
    const user = req.session.user;

    if (!user || user === undefined) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    } else {
      if (user.role === 'USER') {
        return {
          props: { user },
        };
      } else {
        return {
          redirect: {
            destination: '/user/profile',
            permanent: false,
          },
        };
      }
    }
  }
);
