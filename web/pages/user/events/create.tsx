import CreateEventForm from '../../../components/forms/events/CreateEventForm';
import Container from '../../../layout/main/Container';
import DividerLine from '../../../layout/main/DividerLine';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';

export default function CreateEventPage() {
  return (
    <>
      <Header />

      <Container>
        <h1 className='page__title'>Create new event</h1>
        <p className='pb-2'>
          Enter your event details here to create your event. You can add the
          event image in the next step.
        </p>
        <DividerLine className='pb-4' />
        <CreateEventForm />
      </Container>
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
