import { Request, Response } from 'express';
import { prismaDB } from '..';
import slugify from 'slugify';
import { CreateAddressType, UpdateAddressType } from '../models/address.model';
import { CreateEventType, UpdateEventType } from '../models/event.model';
import checkValidUuid from '../utils/checkValidUuid';
import checkEventTypeMatchesQuery from '../utils/event.utils';

export async function getAllEventsController(req: Request, res: Response) {
  try {
    let allEvents = [];

    if (req.query.type) {
      if (!checkEventTypeMatchesQuery(req.query.type as string)) {
        return res
          .status(404)
          .json({ success: false, error: 'No events found' });
      }

      allEvents = await prismaDB.event.findMany({
        where: { public: true, typeSlug: req.query.type as string },
      });
    } else {
      allEvents = await prismaDB.event.findMany({
        where: { public: true },
      });
    }

    return res.status(200).json({ success: true, data: allEvents });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

export async function getAdminUserEventsController(
  req: Request,
  res: Response
) {
  try {
    const { adminUserId } = req.params;

    if (!checkValidUuid(adminUserId)) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const events = await prismaDB.event.findMany({
      where: {
        userId: adminUserId,
      },
    });

    return res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

export async function getSingleEventController(req: Request, res: Response) {
  try {
    const { eventId } = req.params;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const event = await prismaDB.event.findUnique({
      where: { id: eventId },
      include: { BookingType: true, Address: true },
    });

    if (!event || !event.public) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

export async function createEventController(req: Request, res: Response) {
  try {
    const { adminUserId }: { adminUserId?: string } = req.params;

    const user = await prismaDB.user.findUnique({
      where: { id: adminUserId },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const {
      event,
      address,
    }: { event: CreateEventType; address: CreateAddressType } = req.body;

    const eventSlug = slugify(event.name, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });
    const eventTypeSlug = slugify(event.type, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });

    const newEvent = await prismaDB.event.create({
      data: {
        ...event,
        slug: eventSlug,
        typeSlug: eventTypeSlug,
        date: new Date(event.date),
        Address: {
          create: address,
        },
        User: {
          connect: {
            id: adminUserId,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: newEvent });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

export async function updateEventAddressController(
  req: Request,
  res: Response
) {
  try {
    const { addressId }: { addressId?: string } = req.params;
    const { address }: { address: UpdateAddressType } = req.body;

    if (!checkValidUuid(addressId)) {
      return res
        .status(404)
        .json({ success: false, error: 'Address not found' });
    }

    const updatedAddress = await prismaDB.address.update({
      where: { id: addressId },
      data: {
        ...address,
      },
    });

    return res.status(200).json({ success: true, data: updatedAddress });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

export async function updateEventController(req: Request, res: Response) {
  try {
    const { eventId }: { eventId?: string } = req.params;
    const { event }: { event: UpdateEventType } = req.body;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const eventSlug = slugify(event.name, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });
    const eventTypeSlug = slugify(event.type, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });

    const updatedEvent = await prismaDB.event.update({
      where: { id: eventId },
      data: {
        ...event,
        slug: eventSlug,
        typeSlug: eventTypeSlug,
        date: new Date(event.date),
      },
    });

    return res.status(200).json({ success: true, data: updatedEvent });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

export async function deleteEventController(req: Request, res: Response) {
  try {
    const { eventId }: { eventId?: string } = req.params;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const deletedEvent = await prismaDB.event.delete({
      where: { id: eventId },
    });

    return res.status(200).json({ success: true, data: deletedEvent });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}
