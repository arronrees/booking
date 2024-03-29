import { Request, Response } from 'express';
import { prismaDB } from '..';
import { JsonApiResponse, ResLocals } from '../constant-types';
import {
  CreateBookingTypeType,
  UpdateBookingTypeType,
} from '../models/bookingtype.model';
import checkValidUuid from '../utils/checkValidUuid';

// POST /create/:eventId
export async function createBookingTypeController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { eventId }: { eventId?: string } = req.params;
    const { bookingType }: { bookingType: CreateBookingTypeType } = req.body;
    const { user } = res.locals;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const event = await prismaDB.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.userId !== user.id) {
      return res.status(401).json({ success: false, error: 'Not users event' });
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

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

// PUT /update/:bookingTypeId
export async function updateBookingTypeController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { bookingTypeId }: { bookingTypeId?: string } = req.params;
    const { bookingType }: { bookingType: UpdateBookingTypeType } = req.body;
    const { user } = res.locals;

    // check id sent is valid
    if (!checkValidUuid(bookingTypeId)) {
      return res
        .status(404)
        .json({ success: false, error: 'Booking Type not found' });
    }

    // check if booking type exists
    const thisBookingType = await prismaDB.bookingType.findUnique({
      where: { id: bookingTypeId },
    });

    if (!thisBookingType) {
      return res
        .status(404)
        .json({ success: false, error: 'Booking Type not found' });
    }

    // check event exists and is correct user
    const event = await prismaDB.event.findUnique({
      where: { id: thisBookingType.eventId },
    });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.userId !== user.id) {
      return res.status(401).json({ success: false, error: 'Not users event' });
    }

    // if max bookings is being lowered, carry on
    if (thisBookingType.maxBookings >= bookingType.maxBookings) {
      const updatedBookingType = await prismaDB.bookingType.update({
        where: { id: bookingTypeId },
        data: {
          ...bookingType,
        },
      });

      return res.status(200).json({ success: true });
    }

    // need to check total max bookings
    // calculate maximum allowed booking types
    const currentBookingTypes = await prismaDB.bookingType.findMany({
      where: { eventId: thisBookingType.eventId },
    });

    let currentBookingAmounts = 0;

    currentBookingTypes.forEach((bType) => {
      // dont add current booking max amount
      if (bType.id !== thisBookingType.id) {
        currentBookingAmounts += bType.maxBookings;
      }
    });

    const remainingAvaliableBookings =
      event.maxBookings - currentBookingAmounts;

    if (remainingAvaliableBookings < bookingType.maxBookings) {
      return res.status(400).json({
        success: false,
        error:
          'Cannot create booking type, total booking types exceed max bookings of event',
      });
    }

    const updatedBookingType = await prismaDB.bookingType.update({
      where: { id: bookingTypeId },
      data: {
        ...bookingType,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}
