import { Router } from 'express';
import {
  createBookingTypeController,
  updateBookingTypeController,
} from '../controllers/bookingtype.controller';
import { checkJwtExits } from '../middleware/auth.middleware';
import {
  checkCreateBookingTypeObjectValid,
  checkUpdateBookingTypeObjectValid,
} from '../middleware/bookingtype.middleware';

export const bookingTypeRouter = Router();

// create booking type
bookingTypeRouter.post(
  '/create/:eventId',
  checkJwtExits,
  checkCreateBookingTypeObjectValid,
  createBookingTypeController
);

// update booking type
bookingTypeRouter.put(
  '/update/:bookingTypeId',
  checkJwtExits,
  checkUpdateBookingTypeObjectValid,
  updateBookingTypeController
);

// delete booking type
bookingTypeRouter.delete('/delete/:bookingTypeId');
