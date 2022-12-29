import Image from 'next/image';
import Link from 'next/link';
import { EventInterfaceFull } from '../../../../../constant-types';
import Header from '../../../../../layout/main/Header';
import { withSessionSsr } from '../../../../../utils/iron/withSession';

interface Props {
  event: EventInterfaceFull;
}

export default function EventPage({ event }: Props) {
  return (
    <div>
      <Header />
      <section className='p-8 mx-auto max-w-6xl'>
        <div className='flex gap-4 mb-6 text-xs'>
          <Link href='/'>Home</Link>
          <span>/</span>
          <Link href='/events'>Events</Link>
          <span>/</span>
          <Link href={`/events/${event.typeSlug}`} className='capitalize'>
            {event.typeSlug}
          </Link>
          <span>/</span>
          <Link
            href={`/events/${event.typeSlug}/view/${event.slug}/${event.id}`}
          >
            {event.name}
          </Link>
        </div>
        <h1 className='font-bold font-title text-5xl mb-6'>{event.name}</h1>
        <div className='h-96 w-full rounded mb-4'>
          <figure>
            <Image src='/glasto.webp' fill alt='' className='rounded' />
          </figure>
        </div>
        <div>
          <p className='font-semibold text-xl mb-2'>
            {event.name} - {event.location} -{' '}
            {new Date(event.date).toDateString()}
          </p>
          <p className='mb-2'>{event.description}</p>
          <Link href='/' className='btn btn--gold block'>
            Buy Tickets
          </Link>
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, res, params }) {
    const user = req.session.user;

    if (!user || user === undefined) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    } else {
      if (!params || !params.id) {
        return {
          props: { user, event: null },
        };
      }

      const eventRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/single/${params.id}`
      );

      const eventData = await eventRes.json();

      return {
        props: { user, event: eventData.data },
      };
    }
  }
);
