import { Request, Response } from 'express';
import { omit } from 'lodash';
import { prismaDB } from '..';
import { CreateAddressType } from '../models/address.model';
import { CreateUserType, SigninUserType } from '../models/user.model';
import {
  comparePassword,
  createJwtToken,
  hashPassword,
} from '../utils/auth.utils';
import checkValidUuid from '../utils/checkValidUuid';
import {
  checkIfUserExists,
  sendEmailVerificationEmail,
} from '../utils/user.utils';

export async function signupUserController(req: Request, res: Response) {
  try {
    const {
      user,
      address,
    }: { user: CreateUserType; address: CreateAddressType } = req.body;

    // check if user already exists in db
    const { userExists } = await checkIfUserExists('email', user.email);

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already registered',
      });
    }

    // if user not registered, continue to create user
    const hash = await hashPassword(user.password);

    delete user.passwordConfirmation;

    const newUser = await prismaDB.user.create({
      data: {
        ...user,
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
      data: omit({ ...newUser, token }, 'password'),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function signinUserController(req: Request, res: Response) {
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

    // generate token
    const token = await createJwtToken(userData.id);

    if (passwordCheck) {
      return res.status(200).json({
        success: true,
        data: omit({ ...userData, token }, 'password'),
      });
    }

    return res
      .status(401)
      .json({ success: false, error: 'Incorrect details, please try again' });
  } catch (err) {
    console.log(err);
  }
}

export async function verifyEmailController(req: Request, res: Response) {
  try {
    const { id, token } = req.params;

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
        return res.status(200).json({ sucess: true });
      }

      if (user.emailVerificationString === token) {
        await prismaDB.user.update({
          where: { id },
          data: { emailVerified: true, emailVerificationString: null },
        });

        return res.status(200).json({ sucess: true });
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
