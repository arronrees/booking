import CreateEventForm from '../../../components/forms/events/CreateEventForm';
import { UserInterface } from '../../../constant-types';
import Header from '../../../layout/main/Header';
import useUser from '../../../utils/iron/useUser';
import { withSessionSsr } from '../../../utils/iron/withSession';

export default function CreateEventPage() {
  const { user }: { user: UserInterface } = useUser();

  return (
    <div>
      <Header />
      <div className='p-8'>
        <section className='bg-mid-blue-1 rounded p-4 shadow'>
          {user && <CreateEventForm user={user} />}
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
