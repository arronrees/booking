import { UserInterface } from '../../../constant-types';
import { withSessionSsr } from '../../../utils/iron/withSession';
import Header from '../../../layout/main/Header';
import UpdateUserDetailsForm from '../../../components/forms/user/UpdateUserDetailsForm';

interface Props {
  user: UserInterface;
}

export default function UpdateUser({ user }: Props) {
  return (
    <div>
      <h1 className='font-bold text-4xl'>Update user page</h1>
      <Header />

      <div className='p-8'>
        <section className='bg-mid-blue-1 rounded p-4 shadow'>
          <UpdateUserDetailsForm user={user} />
        </section>
      </div>
    </div>
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
