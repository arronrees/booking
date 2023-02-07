import { withSessionSsr } from '../../../utils/iron/withSession';
import Header from '../../../layout/main/Header';
import EditUserDetailsForm from '../../../components/forms/user/EditUserDetailsForm';
import EditUserAddressForm from '../../../components/forms/user/EditUserAddressForm';
import useUser from '../../../utils/iron/useUser';
import EditUserEmailForm from '../../../components/forms/user/EditUserEmailForm';
import EditUserPasswordForm from '../../../components/forms/user/EditUserPasswordForm';
import Container from '../../../layout/main/Container';
import { UserInterface } from '../../../constant-types';
import DividerLine from '../../../layout/main/DividerLine';

export default function UpdateUser() {
  const { user }: { user: UserInterface } = useUser();

  return (
    <>
      <Header />

      {user && (
        <Container>
          <h2 className='page__title'>Update my details</h2>
          <DividerLine className='pb-2' />
          <EditUserDetailsForm user={user} />

          <DividerLine className='py-4' />
          <h2 className='page__title'>Update email address</h2>
          <p className='pb-2'>
            If you update your email you will have to re-verify your email
            address.
          </p>
          <DividerLine className='pb-2' />
          <EditUserEmailForm user={user} />

          <DividerLine className='py-4' />
          <h2 className='page__title'>Update password</h2>
          <p className='pb-2'>Leave blank to keep password the same.</p>
          <DividerLine className='pb-2' />
          <EditUserPasswordForm user={user} />

          <DividerLine className='py-4' />
          <h2 className='page__title'>Update address</h2>
          <DividerLine className='pb-2' />
          <EditUserAddressForm address={user.Address} user={user} />
        </Container>
      )}
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
        props: {},
      };
    }
  }
);
