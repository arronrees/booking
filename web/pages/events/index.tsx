import { withSessionSsr } from '../../utils/iron/withSession';
import Header from '../../layout/main/Header';
import EventGrid from '../../components/events/EventGrid';
import { EventInterfaceCompact } from '../../constant-types';
import Container from '../../layout/main/Container';
import DividerLine from '../../layout/main/DividerLine';
import { EventItem } from '../../components/events/EventItem';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function Events({ events }: Props) {
  return (
    <div>
      <Header />

      <Container>
        <h1 className='page__title'>All Events</h1>
        <DividerLine className='pb-6' />

        <EventGrid>
          {events?.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </EventGrid>
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
