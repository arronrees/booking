import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createBookingTypeModel } from '../models/bookingtype.model';

export async function checkCreateBookingTypeObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { bookingType } = req.body;

    createBookingTypeModel.parse(bookingType);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res.status(400).json({ success: false, error: err.format() });
    } else {
      console.log(err);

      return res.status(500).json({ success: false, error: err });
    }
  }
}
