import { UserInterface } from '../../../../constant-types';
import DividerLine from '../../../../layout/main/DividerLine';
import Header from '../../../../layout/main/Header';
import useUser from '../../../../utils/iron/useUser';
import EditUserEmailForm from '../../../../components/forms/user/EditUserEmailForm';
import Container from '../../../../layout/main/Container';

export default function UpdateEmail() {
  const { user }: { user: UserInterface } = useUser();

  return (
    <>
      <Header />

      <Container>
        <h2 className='page__title'>Update email address</h2>
        <p className='pb-2'>
          If you update your email you will have to re-verify your email
          address.
        </p>
        <DividerLine className='pb-2' />
        <EditUserEmailForm user={user} />
      </Container>
    </>
  );
}
