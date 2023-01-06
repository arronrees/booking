import { Router } from 'express';
import {
  createBookingTypeController,
  updateBookingTypeController,
} from '../controllers/bookingtype.controller';
import {
  checkIfUserIsAdmin,
  checkJwtExits,
} from '../middleware/auth.middleware';
import {
  checkCreateBookingTypeObjectValid,
  checkUpdateBookingTypeObjectValid,
} from '../middleware/bookingtype.middleware';

export const bookingTypeRouter = Router();

// create booking type
bookingTypeRouter.post(
  '/create/:eventId',
  checkJwtExits,
  checkIfUserIsAdmin,
  checkCreateBookingTypeObjectValid,
  createBookingTypeController
);

// update booking type
bookingTypeRouter.put(
  '/update/:bookingTypeId',
  checkJwtExits,
  checkIfUserIsAdmin,
  checkUpdateBookingTypeObjectValid,
  updateBookingTypeController
);

// delete booking type
bookingTypeRouter.delete('/delete/:bookingTypeId');
