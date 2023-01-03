import EventGrid from '../../../components/home/EventGrid';
import { EventInterfaceCompact } from '../../../constant-types';
import Header from '../../../layout/main/Header';
import { withSessionSsr } from '../../../utils/iron/withSession';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function EventPage({ events }: Props) {
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
        props: { user, events: null },
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
);
