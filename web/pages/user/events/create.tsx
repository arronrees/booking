import CreateEventForm from '../../../components/forms/events/CreateEventForm';
import { UserInterface } from '../../../constant-types';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';

interface Props {
  user: UserInterface;
}

export default function EventPage({ user }: Props) {
  return (
    <div>
      <h1 className='font-bold text-4xl'>Edit event page</h1>
      <Header />

      <div className='p-8'>
        <section className='bg-mid-blue-1 rounded p-4 shadow'>
          <CreateEventForm user={user} />
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
