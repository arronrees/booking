import { Request, Response, NextFunction } from 'express';
import {
  updateUserEmailModel,
  updateUserModel,
  updateUserPasswordModel,
} from '../models/user.model';
import { z } from 'zod';
import { JsonApiResponse } from '../constant-types';

export async function checkUpdateUserObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    updateUserModel.parse(user);

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

export async function checkUpdateUserEmailObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    updateUserEmailModel.parse(user);

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

export async function checkUpdateUserPasswordObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    updateUserPasswordModel.parse(user);

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
