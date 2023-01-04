import Image from 'next/image';
import EditEventAddressForm from '../../../../components/forms/events/EditEventAddressForm';
import EditEventForm from '../../../../components/forms/events/EditEventForm';
import { EventInterfaceFull } from '../../../../constant-types';
import Header from '../../../../layout/main/Header';
import { withSessionSsr } from '../../../../utils/iron/withSession';

interface Props {
  event: EventInterfaceFull;
}

export default function EditEventPage({ event }: Props) {
  return (
    <div>
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
          props: { event: null },
        };
      }

      const eventRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/single/edit/${params.id}`
      );

      const eventData = await eventRes.json();

      return {
        props: { event: eventData.data },
      };
    }
  }
);
