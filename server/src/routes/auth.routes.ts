import { Router, Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import { validate as uuidValidate } from 'uuid';
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

const checkValidUuid = (id: string) => {
  return uuidValidate(id);
};

type FieldToCheck = 'id' | 'email';

const checkIfUserExists = async (
  fieldToCheck: FieldToCheck,
  fieldValue: string
) => {
  switch (fieldToCheck) {
    case 'id':
      if (!checkValidUuid(fieldValue)) return false;

      const userFoundById = await prismaDB.user.findUnique({
        where: {
          id: fieldValue,
        },
      });

      if (userFoundById) return true;

      break;

    case 'email':
      const userFoundByEmail = await prismaDB.user.findUnique({
        where: {
          email: fieldValue,
        },
      });

      if (userFoundByEmail) return true;

      break;

    default:
      break;
  }

  return false;
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

      const userExists = await checkIfUserExists('email', user.email);

      if (userExists) {
        return res.status(400).json({
          success: false,
          error: { message: 'User already registered' },
        });
      }

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
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        error: { message: 'Something went wrong, please try again' },
      });
    }
  }
);
