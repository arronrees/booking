import SignInForm from '../../components/forms/SignInForm';
import { withSessionSsr } from '../../utils/iron/withSession';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../layout/main/Header';
import DividerLine from '../../layout/main/DividerLine';

export default function SignIn() {
  return (
    <>
      <Header />

      <section className='px-6'>
        <div className='pb-2'>
          <h1 className='pb-2 font-title text-2xl'>Sign In</h1>
          <p>
            If you do not have an account with us, you can sign up{' '}
            <Link href='/auth/signup' className='text-gold font-bold'>
              here.
            </Link>
          </p>
        </div>
        <DividerLine />
        <div className='py-6'>
          <SignInForm />
        </div>
      </section>

      <section className='w-full h-80'>
        <figure>
          <Image src='/glasto.webp' fill alt='' />
        </figure>
      </section>
    </>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user;

    if (user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  }
);
