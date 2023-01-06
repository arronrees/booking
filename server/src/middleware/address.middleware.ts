import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { JsonApiResponse } from '../constant-types';
import { createAddressModel } from '../models/address.model';

export async function checkAddressObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { address } = req.body;

    createAddressModel.parse(address);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());
      console.log(err);

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
