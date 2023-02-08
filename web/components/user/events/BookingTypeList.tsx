import { BookingTypeInterface } from '../../../constant-types';

interface Props {
  bookingTypes: BookingTypeInterface[];
  totalMaxBookings: number;
}

export default function BookingTypeList({
  bookingTypes,
  totalMaxBookings,
}: Props) {
  const currentBookingsUsed = bookingTypes.reduce((a, b) => {
    return a + b.maxBookings;
  }, 0);

  return (
    <>
      <p className='page__title'>
        Booking Types
        <span className='block mt-1 text-gray-400 text-sm font-medium font-sans'>
          - {totalMaxBookings - currentBookingsUsed} bookings available
        </span>
      </p>

      <div className='grid gap-4 pb-6'>
        {bookingTypes.map((bookingType) => (
          <div
            key={bookingType.id}
            className='rounded p-4 bg-dark-blue shadow-md'
          >
            <p className='font-semibold text-lg'>{bookingType.name}</p>
            <p className='text-xs font-light mt-1 mb-2'>
              {bookingType.description}
            </p>

            <p className='font-title mb-3'>
              {new Intl.NumberFormat('en', {
                style: 'currency',
                currency: 'GBP',
              }).format(bookingType.price)}
            </p>
            <p className='text-sm font-light'>
              <span className='font-semibold'>
                {new Intl.NumberFormat('en').format(bookingType.maxBookings)}
              </span>{' '}
              Maximum Bookings
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
