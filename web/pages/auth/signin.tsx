import SignInForm from '../../components/forms/SignInForm';
import { withSessionSsr } from '../../utils/iron/withSession';

export default function SignIn() {
  return (
    <div className='p-10'>
      <h1 className='mb-6 text-6xl mx-auto max-w-xl'>Sign In</h1>

      <SignInForm />
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
