import { Request, Response, NextFunction } from 'express';
import { updateUserEmailModel, updateUserModel } from '../models/user.model';
import { z } from 'zod';

export async function checkUpdateUserObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    updateUserModel.parse(user);

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

export async function checkUpdateUserEmailObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    updateUserEmailModel.parse(user);

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
