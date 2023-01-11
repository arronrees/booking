import { Request, Response } from 'express';
import { prismaDB } from '..';
import slugify from 'slugify';
import { CreateAddressType, UpdateAddressType } from '../models/address.model';
import { CreateEventType, UpdateEventType } from '../models/event.model';
import checkValidUuid from '../utils/checkValidUuid';
import checkEventTypeMatchesQuery from '../utils/event.utils';
import { JsonApiResponse, ResLocals } from '../constant-types';
import path from 'path';
import fs from 'fs';
import { v4 as uuidV4 } from 'uuid';
import sharp from 'sharp';

export async function getAllEventsController(
  req: Request,
  res: Response<JsonApiResponse>
) {
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
      error: 'Something went wrong, please try again',
    });
  }
}

export async function getAdminUserEventsController(
  req: Request,
  res: Response<JsonApiResponse>
) {
  try {
    const { id } = res.locals.user;

    if (!checkValidUuid(id)) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const events = await prismaDB.event.findMany({
      where: {
        userId: id,
      },
    });

    return res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function getSingleEventEditController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { eventId } = req.params;
    const { id } = res.locals.user;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const event = await prismaDB.event.findUnique({
      where: { id: eventId },
      include: { BookingType: true, Address: true },
    });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.userId !== id) {
      return res.status(404).json({ success: false, error: 'Not users event' });
    }

    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function getSingleEventController(
  req: Request,
  res: Response<JsonApiResponse>
) {
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
      error: 'Something went wrong, please try again',
    });
  }
}

export async function createEventController(
  req: Request,
  res: Response<JsonApiResponse>
) {
  try {
    const { id } = res.locals.user;

    const user = await prismaDB.user.findUnique({
      where: { id },
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
            id,
          },
        },
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

export async function updateEventAddressController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { addressId }: { addressId?: string } = req.params;
    const { eventId }: { eventId?: string } = req.params;
    const { address }: { address: UpdateAddressType } = req.body;
    const { id } = res.locals.user;

    if (!checkValidUuid(addressId)) {
      return res
        .status(404)
        .json({ success: false, error: 'Address not found' });
    }

    const foundEvent = await prismaDB.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        userId: true,
        addressId: true,
      },
    });

    if (!foundEvent) {
      return res.status(404).json({ success: false, error: 'No event found' });
    }

    if (foundEvent.userId !== id) {
      return res.status(400).json({ success: false, error: 'Not users event' });
    }

    if (foundEvent.addressId !== addressId) {
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

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function updateEventController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { eventId }: { eventId?: string } = req.params;
    const { event }: { event: UpdateEventType } = req.body;
    const { id } = res.locals.user;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const foundEvent = await prismaDB.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!foundEvent) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (foundEvent.userId !== id) {
      return res.status(401).json({ success: false, error: 'Not users event' });
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

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function deleteEventController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { eventId }: { eventId?: string } = req.params;
    const { id } = res.locals.user;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const foundEvent = await prismaDB.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!foundEvent) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (foundEvent.userId !== id) {
      return res.status(401).json({ success: false, error: 'Not users event' });
    }

    const deletedEvent = await prismaDB.event.delete({
      where: { id: eventId },
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

export async function updateEventImageController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { eventId } = req.params;
    const { id } = res.locals.user;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: 'No file uploaded' });
    }

    const { filename } = req.file;

    const inputImg = fs.readFileSync(
      path.join(__dirname, `../uploads/temp/${filename}`)
    );

    const outputImgDest = 'img/events';
    const outPutImgFilename = `${uuidV4()}-${Date.now()}.webp`;

    const outputImg = await sharp(inputImg)
      .resize(1200)
      .toFile(
        path.join(__dirname, `../uploads/img/events/${outPutImgFilename}`)
      );

    const removedImg = fs.unlinkSync(
      path.join(__dirname, `../uploads/temp/${filename}`)
    );

    const findEvent = await prismaDB.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!findEvent) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (findEvent.userId !== id) {
      const removedImg = fs.unlinkSync(
        path.join(__dirname, `../uploads/img/events/${outPutImgFilename}`)
      );

      return res.status(401).json({ success: false, error: 'Not users event' });
    }

    const event = await prismaDB.event.update({
      where: { id: eventId },
      data: {
        imageFileUrl: `${outputImgDest}/${outPutImgFilename}`,
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

export async function userSaveEventController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { id } = res.locals.user;
    const { eventId } = req.params;

    if (!checkValidUuid(eventId)) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const savedEvent = await prismaDB.userSavedEvent.findFirst({
      where: { userId: id, eventId },
    });

    if (savedEvent) {
      const unsavedEvent = await prismaDB.userSavedEvent.delete({
        where: { id: savedEvent.id },
      });
    } else {
      const newSavedEvent = await prismaDB.userSavedEvent.create({
        data: {
          User: {
            connect: { id },
          },
          Event: {
            connect: { id: eventId },
          },
        },
      });
    }

    return res
      .status(200)
      .json({ success: true, data: savedEvent ? 'unsaved' : 'saved' });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function getSavedEventsController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { id } = res.locals.user;

    const savedEvents = await prismaDB.userSavedEvent.findMany({
      where: { userId: id },
    });

    const allEvents = [];

    for (let i = 0; i < savedEvents.length; i++) {
      const { eventId } = savedEvents[i];

      const event = await prismaDB.event.findUnique({ where: { id: eventId } });

      allEvents.push(event);
    }

    return res.status(200).json({ success: true, data: allEvents });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}
