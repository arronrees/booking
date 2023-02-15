import Link from 'next/link';
import DividerLine from '../../../layout/main/DividerLine';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';

interface Props {
  success: boolean;
}

export default function UserVerifyEmail({ success }: Props) {
  return (
    <>
      <Header />

      <section className='px-6'>
        <div>
          <h1 className='page__title'>
            {success
              ? 'Thanks for confirming your email'
              : ' Unable to confirm your email. Please try again.'}
          </h1>
        </div>
        <DividerLine className='pb-4' />
        <div className='flex gap-4'>
          <Link href='/user/profile' className='btn btn--gold'>
            View my profile
          </Link>
          <Link href='/' className='btn btn--blue'>
            View events
          </Link>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res, params, query }) {
    const user = req.session.user;

    const { id } = params!;
    const { token } = query;

    if (!user || user === undefined) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/email/verify/${id}/${token}`,
        { method: 'POST' }
      );

      if (response.ok) {
        return {
          props: {
            success: true,
          },
        };
      }

      return {
        props: { success: false },
      };
    } else {
      if (user.emailVerified) {
        return {
          redirect: {
            destination: '/user/profile',
            permanent: false,
          },
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/email/verify/${id}/${token}`,
        { method: 'POST' }
      );

      if (response.ok) {
        return {
          props: {
            success: true,
          },
        };
      }

      return {
        props: { success: false },
      };
    }
  }
);
