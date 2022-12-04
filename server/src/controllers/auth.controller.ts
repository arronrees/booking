import { Request, Response } from 'express';
import { omit } from 'lodash';
import { prismaDB } from '..';
import { CreateAddressType } from '../models/address.model';
import {
  CreateAdminUserType,
  CreateStandardUserType,
  SigninUserType,
} from '../models/user.model';
import {
  comparePassword,
  createJwtToken,
  hashPassword,
} from '../utils/auth.utils';
import {
  checkIfAdminUserExists,
  checkIfStandardUserExists,
} from '../utils/user.utils';

export async function signupStandardUserController(
  req: Request,
  res: Response
) {
  try {
    const {
      user,
      address,
    }: { user: CreateStandardUserType; address: CreateAddressType } = req.body;

    // check if user already exists in db
    const { userExists } = await checkIfStandardUserExists('email', user.email);

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already registered',
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

    // generate token
    const token = await createJwtToken(newUser.id);

    return res
      .status(200)
      .json({
        success: true,
        data: omit({ ...newUser, token, userType: 'standard' }, 'password'),
      });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function signinStandardUserController(
  req: Request,
  res: Response
) {
  try {
    const { user }: { user: SigninUserType } = req.body;

    // check if user exists in db before checking password
    const { userExists, userData } = await checkIfStandardUserExists(
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
        data: omit({ ...userData, token, userType: 'standard' }, 'password'),
      });
    }

    return res
      .status(401)
      .json({ success: false, error: 'Incorrect details, please try again' });
  } catch (err) {
    console.log(err);
  }
}
export async function signupAdminUserController(req: Request, res: Response) {
  try {
    const {
      user,
      address,
    }: { user: CreateAdminUserType; address: CreateAddressType } = req.body;

    // check if user already exists in db
    const { userExists } = await checkIfAdminUserExists('email', user.email);

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already registered',
      });
    }

    // if user not registered, continue to create user
    const hash = await hashPassword(user.password);

    const newUser = await prismaDB.adminUser.create({
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

    return res.status(200).json({
      success: true,
      data: omit({ ...newUser, token, userType: 'admin' }, 'password'),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

export async function signinAdminUserController(req: Request, res: Response) {
  try {
    const { user }: { user: SigninUserType } = req.body;

    // check if user exists in db before checking password
    const { userExists, userData } = await checkIfAdminUserExists(
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
        data: omit({ ...userData, token, userType: 'admin' }, 'password'),
      });
    }

    return res
      .status(401)
      .json({ success: false, error: 'Incorrect details, please try again' });
  } catch (err) {
    console.log(err);
  }
}
