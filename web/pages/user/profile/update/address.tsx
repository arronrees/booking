import { UserInterface } from '../../../../constant-types';
import DividerLine from '../../../../layout/main/DividerLine';
import Header from '../../../../layout/main/Header';
import useUser from '../../../../utils/iron/useUser';
import EditUserAddressForm from '../../../../components/forms/user/EditUserAddressForm';
import Container from '../../../../layout/main/Container';

export default function UpdateMyDetails() {
  const { user }: { user: UserInterface } = useUser();

  return (
    <>
      <Header />

      <Container>
        <h2 className='page__title'>Update address</h2>
        <DividerLine className='pb-2' />
        <EditUserAddressForm address={user.Address} user={user} />
      </Container>
    </>
  );
}
