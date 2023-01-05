import SignUpForm from '../../components/forms/SignupForm';
import { withSessionSsr } from '../../utils/iron/withSession';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUp() {
  return (
    <div className='grid lg:grid-cols-5 gap-4 lg:h-screen overflow-hidden'>
      <section className='lg:col-span-3 p-8 flex flex-col justify-center lg:p-16 xl:px-[10%]'>
        <div className='max-w-2xl mx-auto w-full'>
          <h1 className='mb-8 text-3xl font-title lg:text-6xl'>Sign Up</h1>
          <SignUpForm />
          <p className='mt-8 text-light-blue'>
            If you already have an account, you can sign in{' '}
            <Link href='/auth/signin' className='mt-8 text-white'>
              here.
            </Link>
          </p>
        </div>
      </section>
      <section className='lg:col-span-2 w-full h-80 lg:h-full'>
        <figure>
          <Image src='/glasto.webp' fill alt='' />
        </figure>
      </section>
    </div>
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
