import { Request, Response } from 'express';
import { omit } from 'lodash';
import { prismaDB } from '..';
import { JsonApiResponse, ResLocals } from '../constant-types';
import { UpdateAddressType } from '../models/address.model';
import {
  UpdateUserEmailType,
  UpdateUserPasswordType,
  UpdateUserType,
} from '../models/user.model';
import { hashPassword } from '../utils/auth.utils';
import checkValidUuid from '../utils/checkValidUuid';
import { sendEmailVerificationEmail } from '../utils/user.utils';

// GET /
export async function getSingleUserController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { user } = res.locals;

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: omit({ ...user, token: res.locals.userToken }, [
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

// GET /saved-events
export async function getUserSavedEventsController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { id } = res.locals.user;

    const savedEvents = await prismaDB.userSavedEvent.findMany({
      where: { userId: id },
    });

    return res.status(200).json({ success: true, data: savedEvents });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

// POST /resend-verification-email
export async function postResendVerficationEmailController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { user } = res.locals;

    await sendEmailVerificationEmail(user.email, user.id, user.name);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

// PUT /update
export async function updateUserController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { user: currentUser } = res.locals;
    const { user }: { user: UpdateUserType } = req.body;

    if (!currentUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updatedUser = await prismaDB.user.update({
      where: { id: currentUser.id },
      data: {
        ...user,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

// PUT /update-address
export async function updateUserAddressController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { addressId } = res.locals.user;
    const { address }: { address: UpdateAddressType } = req.body;

    if (!checkValidUuid(addressId)) {
      return res
        .status(404)
        .json({ success: false, error: 'Address not found' });
    }

    const updatedAddress = await prismaDB.address.update({
      where: { id: addressId },
      data: {
        ...address,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

// PUT /update-email
export async function updateUserEmailController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { user: currentUser } = res.locals;
    const { user }: { user: UpdateUserEmailType } = req.body;

    if (!currentUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // check if email sent is same as current email
    if (currentUser.email === user.email) {
      return res.status(400).json({
        success: false,
        error: 'New email is the same as current email',
      });
    }

    // check if a user exists with the email wanting to update to
    const anotherUser = await prismaDB.user.findUnique({
      where: { email: user.email },
    });

    if (anotherUser) {
      return res
        .status(400)
        .json({ success: false, error: 'Email already in use' });
    }

    const updatedUser = await prismaDB.user.update({
      where: { id: currentUser.id },
      data: {
        email: user.email,
        emailVerified: false,
      },
    });

    await sendEmailVerificationEmail(
      updatedUser.email,
      updatedUser.id,
      updatedUser.name
    );

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

// PUT /update-password
export async function updateUserPasswordController(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { user: currentUser } = res.locals;
    const { user }: { user: UpdateUserPasswordType } = req.body;

    if (!currentUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const hash = await hashPassword(user.password);

    const updatedUser = await prismaDB.user.update({
      where: { id: currentUser.id },
      data: {
        password: hash,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}
