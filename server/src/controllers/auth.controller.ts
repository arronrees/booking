import { Request, Response } from 'express';
import { omit } from 'lodash';
import { prismaDB } from '..';
import { CreateAddressType } from '../models/address.model';
import { CreateStandardUserType } from '../models/user.model';
import { checkIfUserExists } from '../utils/user.utils';

export async function signupController(req: Request, res: Response) {
  try {
    const {
      user,
      address,
    }: { user: CreateStandardUserType; address: CreateAddressType } = req.body;

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
