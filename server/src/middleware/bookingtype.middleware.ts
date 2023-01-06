import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { JsonApiResponse } from '../constant-types';
import {
  createBookingTypeModel,
  updateBookingTypeModel,
} from '../models/bookingtype.model';

export async function checkCreateBookingTypeObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { bookingType } = req.body;

    createBookingTypeModel.parse(bookingType);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      console.log(err);

      return res
        .status(500)
        .json({
          success: false,
          error: 'Something went wrong, please try again',
        });
    }
  }
}

export async function checkUpdateBookingTypeObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { bookingType } = req.body;

    updateBookingTypeModel.parse(bookingType);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      console.log(err);

      return res
        .status(500)
        .json({
          success: false,
          error: 'Something went wrong, please try again',
        });
    }
  }
}
