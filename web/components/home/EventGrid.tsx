import Link from 'next/link';
import Image from 'next/image';
import { EventInterface } from '../../constant-types';

interface Props {
  events: [EventInterface] | null;
}

export default function EventGrid({ events }: Props) {
  return (
    <section className='grid gap-6 p-6 xs:grid-cols-2 md:grid-cols-3 max-w-7xl mx-auto'>
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
            <div className='p-4 rounded-b bg-white text-dark-blue'>
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
  );
}
