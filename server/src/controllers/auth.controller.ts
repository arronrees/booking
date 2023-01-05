import { Request, Response } from 'express';
import { omit } from 'lodash';
import { prismaDB } from '..';
import { JsonApiResponse } from '../constant-types';
import { CreateAddressType } from '../models/address.model';
import {
  CreateUserToSaveType,
  CreateUserType,
  SigninUserType,
} from '../models/user.model';
import {
  comparePassword,
  createJwtToken,
  hashPassword,
} from '../utils/auth.utils';
import checkValidUuid from '../utils/checkValidUuid';
import { sendEmailVerificationEmail } from '../utils/user.utils';

export async function signupUserController(
  req: Request,
  res: Response<JsonApiResponse>
) {
  try {
    const {
      user,
      address,
    }: { user: CreateUserType; address: CreateAddressType } = req.body;

    // check if user already exists in db
    const userExists = await prismaDB.user.findUnique({
      where: { email: user.email },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already registered',
      });
    }

    const userToSave: CreateUserToSaveType = { ...user };

    // if user not registered, continue to create user
    const hash = await hashPassword(userToSave.password);

    delete userToSave.passwordConfirmation;

    const newUser = await prismaDB.user.create({
      data: {
        ...userToSave,
        password: hash,
        Address: {
          create: address,
        },
      },
    });

    // generate token
    const token = await createJwtToken(newUser.id);

    // send verification email
    await sendEmailVerificationEmail(user.email, newUser.id, newUser.name);

    return res.status(200).json({
      success: true,
      data: omit({ ...newUser, token }, [
        'password',
        'emailVerificationString',
      ]),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function signinUserController(
  req: Request,
  res: Response<JsonApiResponse>
) {
  try {
    const { user }: { user: SigninUserType } = req.body;

    // check if user exists in db before checking password
    const userExists = await prismaDB.user.findUnique({
      where: { email: user.email },
      include: { Address: true },
    });

    if (!userExists) {
      return res
        .status(401)
        .json({ success: false, error: 'Incorrect details, please try again' });
    }

    // compare passwords
    const passwordCheck = await comparePassword(
      user.password,
      userExists.password
    );

    // generate token
    const token = await createJwtToken(userExists.id);

    if (!passwordCheck) {
      return res
        .status(401)
        .json({ success: false, error: 'Incorrect details, please try again' });
    }

    return res.status(200).json({
      success: true,
      data: omit({ ...userExists, token }, [
        'password',
        'emailVerificationString',
      ]),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function verifyEmailController(
  req: Request,
  res: Response<JsonApiResponse>
) {
  try {
    const { id, token }: { id?: string; token?: string } = req.params;

    if (!id || !token) {
      return res
        .status(400)
        .json({ success: false, error: 'No ID or token provided' });
    }

    if (!checkValidUuid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const user = await prismaDB.user.findUnique({ where: { id } });

    if (user) {
      if (user.emailVerified) {
        return res.status(200).json({ success: true });
      }

      if (user.emailVerificationString === token) {
        await prismaDB.user.update({
          where: { id },
          data: { emailVerified: true, emailVerificationString: null },
        });

        return res.status(200).json({ success: true });
      }
    }

    return res.status(400).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}
