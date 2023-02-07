import { withSessionSsr } from '../utils/iron/withSession';
import Header from '../layout/main/Header';
import EventGrid from '../components/home/EventGrid';
import { EventInterfaceCompact } from '../constant-types';
import Container from '../layout/main/Container';
import DividerLine from '../layout/main/DividerLine';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function Home({ events }: Props) {
  return (
    <div>
      <Header />

      <Container>
        <div>
          <h2 className='page__title'>Featured Events</h2>
          <EventGrid events={events} />
          <DividerLine className='py-6' />
        </div>
      </Container>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user || null;

    const eventsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events`
    );

    const eventsData = await eventsRes.json();

    return {
      props: { events: eventsData.data },
    };
  }
);
