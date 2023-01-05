import { UserInterface } from '../../../constant-types';
import { withSessionSsr } from '../../../utils/iron/withSession';
import Header from '../../../layout/main/Header';
import EditUserDetailsForm from '../../../components/forms/user/EditUserDetailsForm';
import EditUserAddressForm from '../../../components/forms/user/EditUserAddressForm';
import useUser from '../../../utils/iron/useUser';
import EditUserEmailForm from '../../../components/forms/user/EditUserEmailForm';

interface Props {
  user: UserInterface;
}

export default function UpdateUser() {
  const { user } = useUser();

  return (
    <div>
      <Header />

      <div className='p-8 grid gap-6'>
        <section className='bg-mid-blue-1 rounded p-4 shadow'>
          {user && <EditUserDetailsForm user={user} />}
        </section>
        <section className='bg-mid-blue-1 rounded p-4 shadow'>
          {user && <EditUserEmailForm user={user} />}
        </section>
        <section className='bg-mid-blue-1 rounded p-4 shadow'>
          {user && <EditUserAddressForm address={user.Address} user={user} />}
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
        props: {},
      };
    }
  }
);
