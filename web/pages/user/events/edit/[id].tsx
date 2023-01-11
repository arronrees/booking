import Image from 'next/image';
import EditEventAddressForm from '../../../../components/forms/events/EditEventAddressForm';
import EditEventForm from '../../../../components/forms/events/EditEventForm';
import EditEventImageForm from '../../../../components/forms/events/EditEventImageForm';
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
        <div className='h-96 w-full rounded mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='h-64 sm:h-auto lg:col-span-3'>
            <figure>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${event.imageFileUrl}`}
                fill
                alt=''
                className='rounded'
              />
            </figure>
          </div>
          <div className='bg-mid-blue-1 rounded p-4 shadow'>
            <EditEventImageForm eventId={event.id} />
          </div>
        </div>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='bg-mid-blue-1 rounded p-4 shadow'>
            <EditEventForm event={event} />
          </div>
          <div className='bg-mid-blue-1 rounded p-4 shadow'>
            <EditEventAddressForm address={event.Address} eventId={event.id} />
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/single/edit/${params.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const eventData = await eventRes.json();

      if (!eventRes.ok) {
        return {
          redirect: {
            destination: '/user/my-events',
            permanent: false,
          },
        };
      }

      return {
        props: { event: eventData.data },
      };
    }
  }
);
