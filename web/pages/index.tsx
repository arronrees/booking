import { withSessionSsr } from '../utils/iron/withSession';
import Header from '../layout/main/Header';
import EventGrid from '../components/events/EventGrid';
import { EventInterfaceCompact } from '../constant-types';
import Container from '../layout/main/Container';
import DividerLine from '../layout/main/DividerLine';
import { EventItem } from '../components/events/EventItem';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function Home({ events }: Props) {
  return (
    <>
      <Header />

      <Container>
        <div>
          <h2 className='page__title'>Featured Events</h2>
          <DividerLine className='pb-6' />

          <EventGrid>
            {events?.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </EventGrid>
          <DividerLine className='py-6' />
        </div>
      </Container>
    </>
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
