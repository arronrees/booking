import Image from 'next/image';
import EditEventAddressForm from '../../../../components/forms/events/EditEventAddressForm';
import EditEventForm from '../../../../components/forms/events/EditEventForm';
import { EventInterface } from '../../../../constant-types';
import Header from '../../../../layout/main/Header';
import { withSessionSsr } from '../../../../utils/iron/withSession';

interface Props {
  event: EventInterface;
}

export default function EventPage({ event }: Props) {
  return (
    <div>
      <h1 className='font-bold text-4xl'>Edit event page</h1>
      <Header />
      <section className='p-8'>
        <h1 className='font-bold font-title text-5xl mb-6'>{event.name}</h1>
        <div className='h-96 w-full rounded mb-6'>
          <figure>
            <Image src='/glasto.webp' fill alt='' className='rounded' />
          </figure>
        </div>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='bg-mid-blue-1 rounded p-4 shadow'>
            <EditEventForm event={event} />
          </div>
          <div className='bg-mid-blue-1 rounded p-4 shadow'>
            <EditEventAddressForm address={event.Address} />
          </div>
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
