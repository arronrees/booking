import { Request, Response } from 'express';
import { prismaDB } from '..';
import checkValidUuid from '../utils/checkValidUuid';

export async function createBookingTypeController(req: Request, res: Response) {
  try {
    const { eventId } = req.params;
    const { bookingType } = req.body;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const event = await prismaDB.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const currentBookingTypes = await prismaDB.bookingType.findMany({
      where: { eventId },
    });

    let currentBookingAmounts = 0;

    currentBookingTypes.forEach((bookingType) => {
      currentBookingAmounts += bookingType.maxBookings;
    });

    if (currentBookingAmounts + bookingType.maxBookings > event.maxBookings) {
      return res.status(400).json({
        success: false,
        error:
          'Cannot create booking type, total booking types exceed max bookings of event',
      });
    }

    const newBookingType = await prismaDB.bookingType.create({
      data: {
        ...bookingType,
        eventId,
      },
    });

    if (!newBookingType) {
      return res.status(500).json({
        success: false,
        error: 'Could not create Booking Type, please try again',
      });
    }

    return res.status(200).json({ success: true, data: newBookingType });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}
