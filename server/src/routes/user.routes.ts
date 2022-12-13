import { Router } from 'express';
import {
  getSingleUserController,
  updateUserAddressController,
} from '../controllers/user.controller';
import { checkAddressObjectValid } from '../middleware/address.middleware';

export const userRouter = Router();

// get user information
userRouter.get('/:userId', getSingleUserController);

// update user address
userRouter.put(
  '/update-address/:addressId',
  checkAddressObjectValid,
  updateUserAddressController
);
