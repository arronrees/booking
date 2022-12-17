import { withSessionSsr } from '../../../utils/iron/withSession';
import Image from 'next/image';
import Link from 'next/link';

enum EventType {
  MUSIC = 'MUSIC',
  FESTIVAL = 'FESTIVAL',
  THEATRE = 'THEATRE',
  SPORT = 'SPORT',
  OTHER = 'OTHER',
}

interface Props {
  events:
    | [
        {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          name: string;
          description: string;
          date: Date;
          location: string | null;
          type: EventType;
          public: boolean;
          maxBookings: number;
          addressId: string;
          userId: string;
        }
      ]
    | null;
}

export default function Profile({ events }: Props) {
  return (
    <div className='p-6'>
      <h1 className='mb-8 text-3xl font-title lg:text-6xl'>My Events</h1>

      <section className='grid gap-6 p-6 xs:grid-cols-2 md:grid-cols-3 max-w-7xl mx-auto'>
        {events?.map((event) => (
          <Link href='/' key={event.id} className='h-full w-full'>
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
              <div className='p-4 rounded-b bg-white text-dark-blue'>
                <h3 className='font-title mb-2 text-2xl'>{event.name}</h3>
                <p>
                  <span className='capitalize'>
                    {event.type.toLowerCase()} -{' '}
                    <span>{new Date(event.date).toDateString()}</span>
                    <span>{event.location}</span>
                  </span>
                </p>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </div>
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
    } else if (user.role === 'ADMIN') {
      const eventsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`
      );

      const eventsData = await eventsRes.json();

      return {
        props: { user, events: eventsData.data },
      };
    } else {
      return {
        props: { user },
      };
    }
  }
);
