import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { UserInterface } from '../../constant-types';
import DividerLine from '../../layout/main/DividerLine';
import Header from '../../layout/main/Header';
import { withSessionSsr } from '../../utils/iron/withSession';

type Props = {
  user: UserInterface;
};

export default function SignUpConfirmation({ user }: Props) {
  const router = useRouter();

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/resend-verification-email`,
      { method: 'POST', headers: { Authorization: `Bearer ${user.token}` } }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error('Error resending email confirmation, please try again.');
      return;
    }

    const response = await fetch('/api/user/update');

    toast.success('Email confirmation successfully sent.');
    router.push('/');
    return;
  };

  return (
    <>
      <Header />

      <section className='px-6'>
        <div>
          <h1 className='page__title'>Welcome!</h1>
          <p className='pb-4'>
            Thank you for becoming a YourTicket member. Please check your email
            to verify your account before you can continue using the site.
          </p>
          <p>
            If you haven’t received an email from us, click below to resend
            verification email.
          </p>
        </div>
        <DividerLine className='py-4' />
        <div>
          <button className='btn btn--blue' onClick={handleButtonClick}>
            Resend verification email
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
      return {
        props: { user },
      };
    }
  }
);
