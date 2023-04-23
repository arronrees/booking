import { UserInterface } from '../../../../constant-types';
import DividerLine from '../../../../layout/main/DividerLine';
import Header from '../../../../layout/main/Header';
import useUser from '../../../../utils/iron/useUser';
import EditUserDetailsForm from '../../../../components/forms/user/EditUserDetailsForm';
import Container from '../../../../layout/main/Container';

export default function UpdateMyDetails() {
  const { user }: { user: UserInterface } = useUser();

  return (
    <>
      <Header />

      <Container>
        <h2 className='page__title'>Update my details</h2>
        <DividerLine className='pb-2' />
        <EditUserDetailsForm user={user} />
      </Container>
    </>
  );
}
