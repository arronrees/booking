import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createAddressModel } from '../models/address.model';
import {
  createAdminUserModel,
  createStandardUserModel,
  signinUserModel,
} from '../models/user.model';

export async function checkStandardUserSignupObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user, address } = req.body;

    createStandardUserModel.parse(user);
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

export async function checkAdminUserSignupObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user, address } = req.body;

    createAdminUserModel.parse(user);
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

export async function checkUserSigninObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    signinUserModel.parse(user);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res.status(400).json({ success: false, error: err.format() });
    } else {
      return res.status(500).json({ success: false, error: err });
    }
  }
}
