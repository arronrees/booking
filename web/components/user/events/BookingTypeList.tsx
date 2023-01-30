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
      <p className='font-title text-xl text-gold'>
        Booking Types{' '}
        <span className='text-gray-400 text-base'>
          - {totalMaxBookings - currentBookingsUsed} Bookings Remaining
        </span>
      </p>

      <div className='grid gap-4'>
        {bookingTypes.map((bookingType) => (
          <div
            key={bookingType.id}
            className='border-2 rounded p-4 border-gray-500'
          >
            <p className='font-semibold text-lg'>{bookingType.name}</p>
            <p className='text-sm font-light mb-2'>{bookingType.description}</p>
            <p className='font-bold text-gold'>
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
