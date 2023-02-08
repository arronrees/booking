import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { EventInterfaceFull } from '../../../../../constant-types';
import Container from '../../../../../layout/main/Container';
import DividerLine from '../../../../../layout/main/DividerLine';
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
    <>
      <Header />

      <Container>
        <div className='flex gap-4 text-xs'>
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
        <DividerLine className='py-4' />
        <section className='flex justify-between'>
          <div>
            <h1 className='font-title text-3xl mb-1'>{event.name}</h1>
            <p className='text-sm text-gray-400 flex gap-3 items-center'>
              <span>{event.location}</span>
              <span className='bg-gray-400 w-[2px] h-[2px] block rounded-full'></span>
              <span>{new Date(event.date).toDateString()}</span>
            </p>
          </div>
          <div>
            {user && (
              <button
                type='button'
                className='bg-red-500 w-10 h-10 flex items-center justify-center rounded shadow-sm'
                onClick={handleSaveEvent}
              >
                {isEventSaved ? (
                  <BookmarkIconSolid className='w-6 h-6 text-red' />
                ) : (
                  <BookmarkIconOutline className='w-6 h-6 text-red' />
                )}
              </button>
            )}
          </div>
        </section>
        <DividerLine className='pt-2 pb-6' />
        <section>
          {event.BookingType.length > 0 ? (
            <>
              <h2 className='page__title'>Available Tickets</h2>
              <div className='grid gap-4'>
                {event.BookingType.map((booking) => (
                  <div
                    key={booking.id}
                    className='rounded p-4 bg-dark-blue shadow-md'
                  >
                    <p className='font-medium text-xl mb-1'>{booking.name}</p>
                    <p className='text-xs font-light mb-2'>
                      {booking.description}
                    </p>
                    <p className='font-title text-lg'>
                      {new Intl.NumberFormat('en', {
                        style: 'currency',
                        currency: 'GBP',
                      }).format(booking.price)}
                    </p>
                    <div className='mt-4 flex gap-4 items-center'>
                      <label htmlFor='quantity' className='form__label'>
                        Quantity
                      </label>
                      <select
                        id='quantity'
                        className='form__input max-w-[10rem]'
                      >
                        <option value='0'>0</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button className='btn btn--gold'>Buy Tickets</button>
              </div>
            </>
          ) : (
            <p>
              Tickets are currently unavailable for purchase, please check back
              soon!
            </p>
          )}
        </section>
        <DividerLine className='py-6' />
        <section className='bg-dark-blue rounded p-6 shadow-md'>
          <p className='page__title'>About the event</p>
          <div className='h-64 w-full rounded mb-4'>
            <figure>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${event.imageFileUrl}`}
                fill
                alt={event.name}
                className='rounded'
              />
            </figure>
          </div>
          <p className='page__title'>{event.name}</p>
          <p className='text-sm'>{event.description}</p>
        </section>
      </Container>
    </>
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

    if (!eventRes.ok) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

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
