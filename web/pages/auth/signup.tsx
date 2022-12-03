import SignupForm from '../../components/forms/SignupForm';
import { withSessionSsr } from '../../utils/iron/withSession';

export default function SignUp() {
  return (
    <div className='p-10'>
      <h1 className='mb-6 text-6xl mx-auto max-w-xl'>Sign Up</h1>

      <SignupForm />
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
    }

    if (!user || user === undefined) {
      return {
        props: {},
      };
    }
  }
);
