import { Router } from 'express';
import {
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
  checkUpdateEventObjectValid,
} from '../middleware/event.middleware';
import {
  createEventController,
  deleteEventController,
  getAllEventsController,
  getSingleEventController,
  updateEventController,
  updateEventAddressController,
  getAdminUserEventsController,
  getSingleEventEditController,
} from '../controllers/event.controller';
import { checkAddressObjectValid } from '../middleware/address.middleware';
import { checkJwtExits } from '../middleware/auth.middleware';

export const eventRouter = Router();

// get all events
eventRouter.get('/', getAllEventsController);

// get admin user events
eventRouter.get(
  '/user/:adminUserId',
  checkJwtExits,
  getAdminUserEventsController
);

// get single event for edit
eventRouter.get(
  '/single/edit/:eventId',
  checkJwtExits,
  getSingleEventEditController
);

// get single event
eventRouter.get('/single/:eventId', getSingleEventController);

// create new event
eventRouter.post(
  '/create/:adminUserId',
  checkJwtExits,
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
  createEventController
);

// update event address
eventRouter.put(
  '/update-address/:addressId',
  checkJwtExits,
  checkAddressObjectValid,
  updateEventAddressController
);

// update an event
eventRouter.put(
  '/update/:eventId',
  checkJwtExits,
  checkUpdateEventObjectValid,
  updateEventController
);

// delete an event
eventRouter.delete('/delete/:eventId', checkJwtExits, deleteEventController);
