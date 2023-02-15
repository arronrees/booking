import { Router } from 'express';
import {
  getSingleUserController,
  updateUserAddressController,
  updateUserController,
  updateUserEmailController,
  updateUserPasswordController,
  getUserSavedEventsController,
  postResendVerficationEmailController,
  postUserAdminRequest,
} from '../controllers/user.controller';
import { checkAddressObjectValid } from '../middleware/address.middleware';
import { checkJwtExits } from '../middleware/auth.middleware';
import {
  checkUpdateUserEmailObjectValid,
  checkUpdateUserObjectValid,
  checkUpdateUserPasswordObjectValid,
} from '../middleware/user.middleware';

export const userRouter = Router();

// get user information
userRouter.get('/', checkJwtExits, getSingleUserController);

// get user saved events
userRouter.get('/saved-events', checkJwtExits, getUserSavedEventsController);

// resend verification email
userRouter.post(
  '/resend-verification-email',
  checkJwtExits,
  postResendVerficationEmailController
);

// user request admin user role
userRouter.post('/admin-request', checkJwtExits, postUserAdminRequest);

// update user details
userRouter.put(
  '/update',
  checkJwtExits,
  checkUpdateUserObjectValid,
  updateUserController
);

// update user address
userRouter.put(
  '/update-address',
  checkJwtExits,
  checkAddressObjectValid,
  updateUserAddressController
);

// update user email address
userRouter.put(
  '/update-email',
  checkJwtExits,
  checkUpdateUserEmailObjectValid,
  updateUserEmailController
);

// update user password
userRouter.put(
  '/update-password',
  checkJwtExits,
  checkUpdateUserPasswordObjectValid,
  updateUserPasswordController
);
