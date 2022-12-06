import { Request, Response } from 'express';
import { prismaDB } from '..';

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

    return res.status(200).json({});
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

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
