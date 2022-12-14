import { Router } from 'express';
import {
  getSingleUserController,
  updateUserAddressController,
  updateUserController,
  updateUserEmailController,
} from '../controllers/user.controller';
import { checkAddressObjectValid } from '../middleware/address.middleware';
import {
  checkUpdateUserEmailObjectValid,
  checkUpdateUserObjectValid,
} from '../middleware/user.middleware';

export const userRouter = Router();

// get user information
userRouter.get('/:userId', getSingleUserController);

// update user address
userRouter.put(
  '/update-address/:addressId',
  checkAddressObjectValid,
  updateUserAddressController
);

// update user email address
userRouter.put(
  '/update-email/:userId',
  checkUpdateUserEmailObjectValid,
  updateUserEmailController
);

// update user details
userRouter.put(
  '/update/:userId',
  checkUpdateUserObjectValid,
  updateUserController
);
