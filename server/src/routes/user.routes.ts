import { Router } from 'express';
import {
  getSingleUserController,
  updateUserAddressController,
  updateUserController,
  updateUserEmailController,
  updateUserPasswordController,
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
userRouter.get('/:userId', checkJwtExits, getSingleUserController);

// update user address
userRouter.put(
  '/update-address/:addressId',
  checkJwtExits,
  checkAddressObjectValid,
  updateUserAddressController
);

// update user email address
userRouter.put(
  '/update-email/:userId',
  checkJwtExits,
  checkUpdateUserEmailObjectValid,
  updateUserEmailController
);

// update user password
userRouter.put(
  '/update-password/:userId',
  checkJwtExits,
  checkUpdateUserPasswordObjectValid,
  updateUserPasswordController
);

// update user details
userRouter.put(
  '/update/:userId',
  checkJwtExits,
  checkUpdateUserObjectValid,
  updateUserController
);
