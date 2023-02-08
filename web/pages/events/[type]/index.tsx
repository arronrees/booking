import EventGrid from '../../../components/events/EventGrid';
import { EventInterfaceCompact } from '../../../constant-types';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function EventTypePage({ events }: Props) {
  return (
    <div>
      <Header />
      <EventGrid events={events} />
    </div>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res, params }) {
    const user = req.session.user || null;

    if (!params || !params.type) {
      return {
        props: { events: null },
      };
    }

    const eventsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events?type=${params.type}`
    );

    const eventsData = await eventsRes.json();

    return {
      props: { events: eventsData.data },
    };
  }
);
