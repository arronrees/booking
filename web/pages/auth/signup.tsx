import SignUpForm from '../../components/forms/SignUpForm';
import { withSessionSsr } from '../../utils/iron/withSession';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../layout/main/Header';
import DividerLine from '../../layout/main/DividerLine';

export default function SignUp() {
  return (
    <>
      <Header />

      <section className='px-6'>
        <div className='pb-2'>
          <h1 className='page__title'>Sign Up</h1>
          <p>
            If you already have an account with us, you can sign in{' '}
            <Link href='/auth/signin' className='text-gold font-bold'>
              here.
            </Link>
          </p>
        </div>
        <DividerLine />
        <div className='py-6'>
          <SignUpForm />
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
