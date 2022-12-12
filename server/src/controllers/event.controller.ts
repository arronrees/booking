import { Request, Response } from 'express';
import { prismaDB } from '..';
import checkValidUuid from '../utils/checkValidUuid';

export async function getAllEventsController(req: Request, res: Response) {
  try {
    const allEvents = await prismaDB.event.findMany({
      where: { public: true },
    });

    res.status(200).json({ success: true, data: allEvents });
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
    const { adminUserId } = req.params;

    const user = await prismaDB.user.findUnique({ where: { id: adminUserId } });

    const { event, address } = req.body;

    const newEvent = await prismaDB.event.create({
      data: {
        ...event,
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

export async function updateEventController(req: Request, res: Response) {
  try {
    const { eventId } = req.params;
    const { event } = req.body;

    if (!checkValidUuid(eventId)) {
      res.status(404).json({ success: false, error: 'Event not found' });
    }

    const updatedEvent = await prismaDB.event.update({
      where: { id: eventId },
      data: {
        ...event,
        date: new Date(event.date),
      },
    });

    res.status(200).json({ success: true, data: updatedEvent });
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
    const { eventId } = req.params;

    if (!checkValidUuid(eventId)) {
      res.status(404).json({ success: false, error: 'Event not found' });
    }

    const deletedEvent = await prismaDB.event.delete({
      where: { id: eventId },
    });

    res.status(200).json({ success: true, data: deletedEvent });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}
