import { UserInterface } from '../../../../constant-types';
import DividerLine from '../../../../layout/main/DividerLine';
import Header from '../../../../layout/main/Header';
import useUser from '../../../../utils/iron/useUser';
import EditUserPasswordForm from '../../../../components/forms/user/EditUserPasswordForm';
import Container from '../../../../layout/main/Container';

export default function UpdateEmail() {
  const { user }: { user: UserInterface } = useUser();

  return (
    <>
      <Header />

      <Container>
        <h2 className='page__title'>Update password</h2>
        <DividerLine className='pb-2' />
        <EditUserPasswordForm user={user} />
      </Container>
    </>
  );
}
