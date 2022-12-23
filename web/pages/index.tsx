import { withSessionSsr } from '../utils/iron/withSession';
import Header from '../layout/main/Header';
import EventGrid from '../components/home/EventGrid';
import { EventInterface } from '../constant-types';

interface Props {
  events: EventInterface[] | null;
}

export default function Home({ events }: Props) {
  return (
    <div>
      <h1 className='font-bold text-4xl'>Home</h1>
      <Header />
      <EventGrid events={events} />
    </div>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user;

    if (!user || user === undefined) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    } else {
      const eventsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`
      );

      const eventsData = await eventsRes.json();

      return {
        props: { user, events: eventsData.data },
      };
    }
  }
);
