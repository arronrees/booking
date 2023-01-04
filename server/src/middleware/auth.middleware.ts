import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prismaDB } from '..';
import { createAddressModel } from '../models/address.model';
import { createUserModel, signinUserModel } from '../models/user.model';
import checkValidUuid from '../utils/checkValidUuid';

export async function checkUserSignupObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user, address } = req.body;

    createUserModel.parse(user);
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

declare module 'jsonwebtoken' {
  export interface UserIdJwtPayload extends jwt.JwtPayload {
    id: string;
  }
}

export async function checkJwtExits(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(401)
        .json({ success: false, error: 'Authorisation token required' });
    }

    const token = authorization.split(' ')[1];

    const { id } = <jwt.UserIdJwtPayload>(
      jwt.verify(token, process.env.JWT_SECRET as string)
    );

    if (!checkValidUuid(id)) {
      return res.status(401).json({ success: false, error: 'Invalid JWT' });
    }

    const user = await prismaDB.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid user' });
    }

    // if user found add to locals object
    res.locals.user = user;
    res.locals.userToken = token;

    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({ success: false, error: 'Invalid JWT' });
  }
}
