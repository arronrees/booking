import { withSessionSsr } from '../../../utils/iron/withSession';
import { EventInterfaceCompact } from '../../../constant-types';
import Header from '../../../layout/main/Header';
import Container from '../../../layout/main/Container';
import EventGrid from '../../../components/events/EventGrid';
import { EventEditItem } from '../../../components/events/EventItem';
import DividerLine from '../../../layout/main/DividerLine';

type Props = {
  events: EventInterfaceCompact[] | null;
};

export default function MyEvents({ events }: Props) {
  return (
    <>
      <Header />
      <Container>
        <div>
          <h1 className='page__title'>My Events</h1>
          <DividerLine className='pb-6' />

          <EventGrid>
            {events?.map((event) => (
              <EventEditItem key={event.id} event={event} />
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
    } else if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
      const eventsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/user`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const eventsData = await eventsRes.json();

      return {
        props: { events: eventsData.data },
      };
    } else {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    }
  }
);
