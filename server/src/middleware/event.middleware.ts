import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { prismaDB } from '..';
import { createAddressModel } from '../models/address.model';
import { createEventModel, updateEventModel } from '../models/event.model';
import { JsonApiResponse } from '../constant-types';

export async function checkAdminUserIdSentIsValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { adminUserId } = req.params;

    const userExists = await prismaDB.user.findUnique({
      where: { id: adminUserId },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid admin user' });
    }

    if (!(userExists.role == 'ADMIN' || userExists.role == 'SUPERADMIN')) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid admin user' });
    }

    next();
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function checkCreateEventObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { event, address } = req.body;

    createEventModel.parse({ ...event, date: new Date(event.date) });
    createAddressModel.parse(address);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: 'Something went wrong, please try again',
      });
    }
  }
}

export async function checkUpdateEventObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { event } = req.body;

    updateEventModel.parse({ ...event, date: new Date(event.date) });

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: 'Something went wrong, please try again',
      });
    }
  }
}
