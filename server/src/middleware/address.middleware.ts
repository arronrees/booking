import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createAddressModel } from '../models/address.model';

export async function checkAddressObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { address } = req.body;

    createAddressModel.parse(address);

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
