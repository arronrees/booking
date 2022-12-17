import { withSessionSsr } from '../utils/iron/withSession';
import Header from '../layout/main/Header';
import EventGrid from '../components/home/EventGrid';

enum EventType {
  MUSIC = 'MUSIC',
  FESTIVAL = 'FESTIVAL',
  THEATRE = 'THEATRE',
  SPORT = 'SPORT',
  OTHER = 'OTHER',
}

interface Props {
  events:
    | [
        {
          id: string;
          name: string;
          type: EventType;
          image: string;
          date: Date;
          location: string | null;
        }
      ]
    | null;
}

export default function Home({ events }: Props) {
  return (
    <div>
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
