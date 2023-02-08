import Image from 'next/image';
import EditEventAddressForm from '../../../../components/forms/events/EditEventAddressForm';
import EditEventForm from '../../../../components/forms/events/EditEventForm';
import EditEventImageForm from '../../../../components/forms/events/EditEventImageForm';
import CreateBookingTypeForm from '../../../../components/forms/events/CreateBookingTypeForm';
import { EventInterfaceFull } from '../../../../constant-types';
import Header from '../../../../layout/main/Header';
import { withSessionSsr } from '../../../../utils/iron/withSession';
import useUser from '../../../../utils/iron/useUser';
import BookingTypeList from '../../../../components/user/events/BookingTypeList';
import Container from '../../../../layout/main/Container';
import DividerLine from '../../../../layout/main/DividerLine';

interface Props {
  event: EventInterfaceFull;
}

export default function EditEventPage({ event }: Props) {
  return (
    <>
      <Header />

      <Container>
        <section>
          <h1 className='page__title'>
            Editing -{' '}
            <span className='text-light-blue-light'>{event.name}</span>
          </h1>
          <DividerLine className='pb-4' />

          <div className='h-48'>
            <figure>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${event.imageFileUrl}`}
                fill
                alt=''
                className='rounded'
              />
            </figure>
          </div>

          <DividerLine className='py-4' />

          <h2 className='page__title'>Upload new event image</h2>
          <DividerLine className='pb-2' />
          <EditEventImageForm eventId={event.id} />
          <DividerLine className='py-4' />

          <h2 className='page__title'>Update event details</h2>
          <DividerLine className='pb-2' />
          <EditEventForm event={event} />
          <DividerLine className='py-4' />

          <h2 className='page__title'>Update event address</h2>
          <DividerLine className='pb-2' />
          <EditEventAddressForm address={event.Address} eventId={event.id} />
          <DividerLine className='py-4' />

          <div>
            {event.BookingType.length > 0 ? (
              <BookingTypeList
                bookingTypes={event.BookingType}
                totalMaxBookings={event.maxBookings}
              />
            ) : (
              <p>No booking types created yet. Create one below.</p>
            )}
            <h2 className='page__title'>Create new booking type</h2>
            <DividerLine className='pb-2' />
            <CreateBookingTypeForm eventId={event.id} />
          </div>
        </section>
      </Container>
    </>
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
