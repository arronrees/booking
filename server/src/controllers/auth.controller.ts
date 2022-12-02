import { Request, Response } from 'express';
import { omit } from 'lodash';
import { prismaDB } from '..';
import { CreateAddressType } from '../models/address.model';
import { CreateStandardUserType, SigninUserType } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/auth.utils';
import { checkIfUserExists } from '../utils/user.utils';

export async function signupController(req: Request, res: Response) {
  try {
    const {
      user,
      address,
    }: { user: CreateStandardUserType; address: CreateAddressType } = req.body;

    // check if user already exists in db
    const { userExists } = await checkIfUserExists('email', user.email);

    console.log(userExists);

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already registered' },
      });
    }

    // if user not registered, continue to create user
    const hash = await hashPassword(user.password);

    const newUser = await prismaDB.user.create({
      data: {
        ...user,
        password: hash,
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
      error: 'Something went wrong, please try again',
    });
  }
}

export async function signinController(req: Request, res: Response) {
  try {
    const { user }: { user: SigninUserType } = req.body;

    // check if user exists in db before checking password
    const { userExists, userData } = await checkIfUserExists(
      'email',
      user.email
    );

    if (!userExists || !userData) {
      return res
        .status(401)
        .json({ success: false, error: 'Incorrect details, please try again' });
    }

    // compare passwords
    const passwordCheck = await comparePassword(
      user.password,
      userData.password
    );

    if (passwordCheck) {
      return res.status(200).json({ success: true });
    }

    return res
      .status(401)
      .json({ success: false, error: 'Incorrect details, please try again' });
  } catch (err) {
    console.log(err);
  }
}
