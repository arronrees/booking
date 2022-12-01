import { Router, Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import { z } from 'zod';
import { prismaDB } from '..';
import { createAddressModel, CreateAddressType } from '../models/address.model';
import {
  createStandardUserModel,
  CreateStandardUserType,
} from '../models/user.model';

export const authRouter = Router();

const checkSignupObjectValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

      return res.status(400).json({ success: false, error: err });
    }
  }
};

authRouter.post(
  '/signup',
  checkSignupObjectValid,
  async (req: Request, res: Response) => {
    try {
      const {
        user,
        address,
      }: { user: CreateStandardUserType; address: CreateAddressType } =
        req.body;

      const newUser = await prismaDB.user.create({
        data: {
          ...user,
          Address: {
            create: address,
          },
        },
      });

      return res
        .status(200)
        .json({ success: true, data: omit(newUser, 'password') });
    } catch (err) {}
  }
);
