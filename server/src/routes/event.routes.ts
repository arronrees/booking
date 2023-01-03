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

export const eventRouter = Router();

// get all events
eventRouter.get('/', getAllEventsController);

// get admin user events
eventRouter.get('/user/:adminUserId', getAdminUserEventsController);

// get single event for edit
eventRouter.get('/single/edit/:eventId', getSingleEventEditController);

// get single event
eventRouter.get('/single/:eventId', getSingleEventController);

// create new event
eventRouter.post(
  '/create/:adminUserId',
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
  createEventController
);

// update event address
eventRouter.put(
  '/update-address/:addressId',
  checkAddressObjectValid,
  updateEventAddressController
);

// update an event
eventRouter.put(
  '/update/:eventId',
  checkUpdateEventObjectValid,
  updateEventController
);

// delete an event
eventRouter.delete('/delete/:eventId', deleteEventController);
