import { withSessionSsr } from '../../utils/iron/withSession';
import Header from '../../layout/main/Header';
import EventGrid from '../../components/home/EventGrid';
import { EventInterfaceCompact } from '../../constant-types';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function Events({ events }: Props) {
  return (
    <div>
      <Header />
      <EventGrid events={events} />
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
      props: { user, events: eventsData.data },
    };
  }
);
