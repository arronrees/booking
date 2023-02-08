import { withSessionSsr } from '../../../utils/iron/withSession';
import { EventInterfaceCompact } from '../../../constant-types';
import Header from '../../../layout/main/Header';
import DividerLine from '../../../layout/main/DividerLine';
import Container from '../../../layout/main/Container';
import EventGrid from '../../../components/events/EventGrid';
import { EventSavedItem } from '../../../components/events/EventItem';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function SavedEvents({ events }: Props) {
  return (
    <>
      <Header />

      <Container>
        <div>
          <h1 className='page__title'>Saved Events</h1>
          <DividerLine className='pb-6' />

          <EventGrid>
            {events?.map((event) => (
              <EventSavedItem key={event.id} event={event} />
            ))}
          </EventGrid>
        </div>
      </Container>
    </>
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/saved-events`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const eventsData = await eventsRes.json();

      return {
        props: { events: eventsData.data },
      };
    }
  }
);
