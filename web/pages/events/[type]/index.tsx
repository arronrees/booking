import EventGrid from '../../../components/events/EventGrid';
import { EventItem } from '../../../components/events/EventItem';
import { EventInterfaceCompact } from '../../../constant-types';
import Container from '../../../layout/main/Container';
import DividerLine from '../../../layout/main/DividerLine';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';

interface Props {
  events: EventInterfaceCompact[] | null;
  type: string;
}

export default function EventTypePage({ events, type }: Props) {
  return (
    <div>
      <Header />

      <Container>
        <h1 className='page__title'>
          Category -{' '}
          <span className='text-light-blue-light capitalize'>{type}</span>
        </h1>
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
  async function getServerSideProps({ req, res, params }) {
    const user = req.session.user || null;

    if (!params || !params.type) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const eventsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events?type=${params.type}`
    );

    const eventsData = await eventsRes.json();

    if (!eventsRes.ok) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: { events: eventsData.data, type: params.type },
    };
  }
);
