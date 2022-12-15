import { Router } from 'express';
import {
  createBookingTypeController,
  updateBookingTypeController,
} from '../controllers/bookingtype.controller';
import {
  checkCreateBookingTypeObjectValid,
  checkUpdateBookingTypeObjectValid,
} from '../middleware/bookingtype.middleware';

export const bookingTypeRouter = Router();

// create booking type
bookingTypeRouter.post(
  '/create/:eventId',
  checkCreateBookingTypeObjectValid,
  createBookingTypeController
);

// update booking type
bookingTypeRouter.put(
  '/update/:bookingTypeId',
  checkUpdateBookingTypeObjectValid,
  updateBookingTypeController
);

// delete booking type
bookingTypeRouter.delete('/delete/:bookingTypeId');
