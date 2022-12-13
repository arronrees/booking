import { Router } from 'express';
import {
  getSingleUserController,
  updateUserAddressController,
  updateUserController,
} from '../controllers/user.controller';
import { checkAddressObjectValid } from '../middleware/address.middleware';
import { checkUpdateUserObjectValid } from '../middleware/user.middleware';

export const userRouter = Router();

// get user information
userRouter.get('/:userId', getSingleUserController);

// update user address
userRouter.put(
  '/update-address/:addressId',
  checkAddressObjectValid,
  updateUserAddressController
);

// update user details
userRouter.put(
  '/update/:userId',
  checkUpdateUserObjectValid,
  updateUserController
);
