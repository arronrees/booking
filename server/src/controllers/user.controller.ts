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

// GET /admin-request
export async function getUserAdminRequests(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { id } = res.locals.user;

    const userAdminRequests = await prismaDB.userAdminRequest.findMany({
      where: { userId: id },
    });

    return res.status(200).json({ success: true, data: userAdminRequests });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

// GET /admin-request/:adminRequestId
export async function getSingleUserAdminRequest(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { adminRequestId } = req.params;

    if (!checkValidUuid(adminRequestId)) {
      return res
        .status(404)
        .json({ success: false, error: 'No admin request found' });
    }

    const findAdminRequest = await prismaDB.userAdminRequest.findFirst({
      where: { id: adminRequestId },
    });

    if (!findAdminRequest) {
      return res
        .status(404)
        .json({ success: false, error: 'No admin request found' });
    }

    return res.status(200).json({ success: true, data: findAdminRequest });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
}

// GET /admin/admin-requests
export async function getAdminRequestsForVerification(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const adminRequests = await prismaDB.userAdminRequest.findMany({
      where: { complete: false },
      include: { User: { select: { name: true } } },
    });

    return res.status(200).json({ success: true, data: adminRequests });
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

// POST /admin-request
export async function postUserAdminRequest(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { user } = res.locals;

    if (user.role !== 'USER') {
      return res
        .status(400)
        .json({ success: false, error: 'User is already admin.' });
    }

    const findAllAdminRequestsFromUser =
      await prismaDB.userAdminRequest.findMany({
        where: {
          userId: user.id,
        },
      });

    if (findAllAdminRequestsFromUser.length >= 5) {
      return res.status(400).json({
        success: false,
        error:
          'User has already submitted 5 admin requests, cannot create another one',
      });
    }

    let canCreateAdminRequest: boolean = true;
    let userAdminRequestError: string = '';

    for (let i = 0; i < findAllAdminRequestsFromUser.length; i++) {
      const request = findAllAdminRequestsFromUser[i];

      if (request.status === 'PENDING' || !request.complete) {
        canCreateAdminRequest = false;
        userAdminRequestError =
          'Cannot create new admin request while user currently has admin request in progress';
        break;
      }

      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

      const requestDate = new Date(request.createdAt);

      // date is within last 3 months
      if (requestDate >= threeMonthsAgo && requestDate <= currentDate) {
        canCreateAdminRequest = false;
        userAdminRequestError =
          'User has requested admin role in the last 3 months, cannot request again yet';
        break;
      }
    }

    if (!canCreateAdminRequest) {
      return res
        .status(400)
        .json({ success: false, error: userAdminRequestError });
    }

    const newRequest = await prismaDB.userAdminRequest.create({
      data: { userId: user.id },
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

// POST /admin/admin-requests/:adminRequestId?result=approveOrDeny
export async function postApproveAdminRequest(
  req: Request,
  res: Response<JsonApiResponse> & { locals: ResLocals }
) {
  try {
    const { user } = res.locals;

    if (user.role !== 'SUPERADMIN') {
      return res.status(400).json({
        success: false,
        error: 'User does not have permissions to do this',
      });
    }

    const { adminRequestId } = req.params;

    if (!adminRequestId) {
      return res
        .status(404)
        .json({ success: false, error: 'No admin request found' });
    }

    if (!checkValidUuid(adminRequestId)) {
      return res
        .status(404)
        .json({ success: false, error: 'No admin request found' });
    }

    const { result }: { result?: string } = req.query;

    if (!result) {
      return res
        .status(400)
        .json({ success: false, error: 'Please provide result of request' });
    }

    const adminRequest = await prismaDB.userAdminRequest.findUnique({
      where: { id: adminRequestId },
    });

    if (!adminRequest) {
      return res
        .status(404)
        .json({ success: false, error: 'No admin request found' });
    }

    if (result === 'approve') {
      const updatedAdminRequest = await prismaDB.userAdminRequest.update({
        where: { id: adminRequestId },
        data: {
          complete: true,
          dateComplete: new Date(),
          status: 'APPROVED',
        },
      });

      return res.status(200).json({ success: true });
    } else if (result === 'deny') {
      const updatedAdminRequest = await prismaDB.userAdminRequest.update({
        where: { id: adminRequestId },
        data: {
          complete: true,
          dateComplete: new Date(),
          status: 'DENIED',
        },
      });

      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please provide correct result of request',
      });
    }
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
