import { withSessionSsr } from '../../../utils/iron/withSession';
import Image from 'next/image';
import Link from 'next/link';
import { EventInterfaceCompact } from '../../../constant-types';
import Header from '../../../layout/main/Header';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function SavedEvents({ events }: Props) {
  return (
    <>
      <Header />
      <div className='p-6'>
        <h1 className='mb-8 text-3xl font-title lg:text-6xl'>Saved Events</h1>

        <section className='grid gap-6 p-6 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {events?.map((event) => (
            <Link
              href={`/events/${event.typeSlug}/view/${event.slug}/${event.id}`}
              key={event.id}
              className='h-full w-full'
            >
              <article className='rounded-t group h-full w-full'>
                <div className='h-40'>
                  <div className='overlay'></div>
                  <figure>
                    <Image
                      src='/glasto.webp'
                      fill
                      alt=''
                      className='rounded-t transition duration-300 group-hover:scale-105'
                    />
                  </figure>
                </div>
                <div className='p-4 rounded-b bg-mid-blue text-white'>
                  <h3 className='font-title mb-2 text-2xl'>{event.name}</h3>
                  <p>
                    <span className='capitalize'>
                      {event.type.toLowerCase()} -{' '}
                      <span>{new Date(event.date).toDateString()}</span> -{' '}
                      <span>{event.location}</span>
                    </span>
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </section>
      </div>
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
