import Link from 'next/link';
import Image from 'next/image';
import { EventInterfaceCompact } from '../../constant-types';

interface Props {
  events: EventInterfaceCompact[] | null;
}

export default function EventGrid({ events }: Props) {
  return (
    <section className='grid gap-4 grid-cols-2'>
      {events?.map((event) => (
        <EventItem event={event} key={event.id} />
      ))}
    </section>
  );
}

export function EventItem({ event }: { event: EventInterfaceCompact }) {
  return (
    <Link
      href={`/events/${event.typeSlug}/view/${event.slug}/${event.id}`}
      key={event.id}
      className='h-full w-full group'
    >
      <article className='rounded-t h-full w-full group-focus:shadow-lg'>
        <div className='h-40'>
          <div className='overlay'></div>
          <figure>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${event.imageFileUrl}`}
              fill
              alt=''
              className='rounded-t transition duration-300 group-hover:scale-105'
            />
          </figure>
        </div>
        <div className='p-3 py-4 rounded-b bg-white text-dark-blue'>
          <h3 className='font-title mb-2 text-lg leading-6'>{event.name}</h3>
          <p className='text-xs text-gray-600'>
            {new Date(event.date).toDateString()}
          </p>
        </div>
      </article>
    </Link>
  );
}
