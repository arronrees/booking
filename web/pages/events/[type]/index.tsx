import EventGrid from '../../../components/home/EventGrid';
import { EventInterface } from '../../../constant-types';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';

interface Props {
  events: [EventInterface] | null;
}

export default function EventPage({ events }: Props) {
  return (
    <div>
      <h1 className='font-bold text-4xl'>Event type page</h1>
      <Header />
      <EventGrid events={events} />
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
      if (!params || !params.type) {
        return {
          props: { user, event: null },
        };
      }

      const eventsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events?type=${params.type}`
      );

      const eventsData = await eventsRes.json();

      return {
        props: { user, events: eventsData.data },
      };
    }
  }
);
