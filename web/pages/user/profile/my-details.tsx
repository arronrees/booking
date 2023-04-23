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
import Link from 'next/link';

export default function UpdateUser() {
  const { user }: { user: UserInterface } = useUser();

  return (
    <>
      <Header />

      {user && (
        <Container>
          <h2 className='page__title'>My Details</h2>
          <ul className='text-sm font-thin flex flex-col gap-1 mb-4'>
            <li>{user.name}</li>
            <li>{user.email}</li>
            <li>{user.telephone}</li>
          </ul>
          <ul className='text-sm font-thin flex flex-col gap-1'>
            <li>{user.Address.addressLine1}</li>
            {user.Address.addressLine2 && <li>{user.Address.addressLine2}</li>}
            <li>{user.Address.town}</li>
            <li>{user.Address.county}</li>
            <li>{user.Address.postcode}</li>
            <li>{user.Address.country}</li>
          </ul>
          <DividerLine className='py-4' />
          <div className='flex gap-4 flex-col items-start text-sm'>
            <Link className='border-b' href='/user/profile/update/my-details'>
              Update my details
            </Link>
            <Link className='border-b' href='/user/profile/update/address'>
              Update my address
            </Link>
            <Link className='border-b' href='/user/profile/update/email'>
              Update my email
            </Link>
            <Link className='border-b' href='/user/profile/update/password'>
              Update my password
            </Link>
          </div>
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
