import { Router } from 'express';
import { createBookingTypeController } from '../controllers/bookingtype.controller';
import { checkCreateBookingTypeObjectValid } from '../middleware/bookingtype.middleware';

export const bookingTypeRouter = Router();

// create booking type
bookingTypeRouter.post(
  '/create/:eventId',
  checkCreateBookingTypeObjectValid,
  createBookingTypeController
);

// update booking type
bookingTypeRouter.put('/update/:bookingTypeId');

// delete booking type
bookingTypeRouter.delete('/delete/:bookingTypeId');
