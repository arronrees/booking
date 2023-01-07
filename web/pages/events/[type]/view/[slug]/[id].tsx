import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { EventInterfaceFull } from '../../../../../constant-types';
import Header from '../../../../../layout/main/Header';
import useUser from '../../../../../utils/iron/useUser';
import { withSessionSsr } from '../../../../../utils/iron/withSession';

interface SavedEvent {
  userId: string;
  eventId: string;
}

interface Props {
  event: EventInterfaceFull;
  savedEvents: SavedEvent[] | null;
}

export default function ViewEventPage({ event, savedEvents }: Props) {
  const { user } = useUser();
  const [isEventSaved, setIsEventSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (savedEvents) {
      const saved = savedEvents.find((ev) => ev.eventId === event.id);

      setIsEventSaved(!!saved);
    }
  }, [savedEvents]);

  const handleSaveEvent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) {
      return router.push('/auth/signin');
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/user/save/${event.id}`,
      { method: 'POST', headers: { Authorization: `Bearer ${user.token}` } }
    );

    const data = await res.json();

    if (!res.ok) {
      if (data.error && typeof data.error === 'string') {
        toast.error(data.error);
        return;
      }
    }

    if (data.data === 'saved') {
      toast.success('Event saved successfully');
    } else {
      toast.success('Event unsaved successfully');
    }
    router.push(router.asPath);
  };

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
        <div className='flex items-center justify-between'>
          <h1 className='font-bold font-title text-5xl mb-6'>{event.name}</h1>
          {user && (
            <button
              type='button'
              className='bg-red-500 w-10 h-10 flex items-center justify-center rounded shadow-sm'
              onClick={handleSaveEvent}
            >
              {isEventSaved ? (
                <HeartIconSolid className='w-4 h-4' />
              ) : (
                <HeartIconOutline className='w-4 h-4' />
              )}
            </button>
          )}
        </div>
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

    if (!params || !params.id) {
      return {
        props: { event: null },
      };
    }

    const eventRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/single/${params.id}`
    );

    const eventData = await eventRes.json();

    if (user) {
      const savedEventsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/saved-events`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const savedEventsData = await savedEventsRes.json();

      return {
        props: { event: eventData.data, savedEvents: savedEventsData.data },
      };
    } else {
      return {
        props: { event: eventData.data, savedEvents: null },
      };
    }
  }
);
