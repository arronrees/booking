import { Router } from 'express';
import {
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
  userSaveEventController,
  getSavedEventsController,
  updateEventImageController,
} from '../controllers/event.controller';
import { checkAddressObjectValid } from '../middleware/address.middleware';
import {
  checkIfUserIsAdmin,
  checkJwtExits,
} from '../middleware/auth.middleware';
import { multerUpload } from '../constants';

export const eventRouter = Router();

// get all events
eventRouter.get('/', getAllEventsController);

// get admin user events
eventRouter.get(
  '/user',
  checkJwtExits,
  checkIfUserIsAdmin,
  getAdminUserEventsController
);

// get user saved events
eventRouter.get('/saved-events', checkJwtExits, getSavedEventsController);

// get single event for edit
eventRouter.get(
  '/single/edit/:eventId',
  checkJwtExits,
  checkIfUserIsAdmin,
  getSingleEventEditController
);

// get single event
eventRouter.get('/single/:eventId', getSingleEventController);

// create new event
eventRouter.post(
  '/create',
  checkJwtExits,
  checkIfUserIsAdmin,
  checkCreateEventObjectValid,
  createEventController
);

// user save an event
eventRouter.post('/user/save/:eventId', checkJwtExits, userSaveEventController);

// update an event
eventRouter.put(
  '/update/:eventId',
  checkJwtExits,
  checkIfUserIsAdmin,
  checkUpdateEventObjectValid,
  updateEventController
);

// update event address
eventRouter.put(
  '/update-address/:eventId/:addressId',
  checkJwtExits,
  checkIfUserIsAdmin,
  checkAddressObjectValid,
  updateEventAddressController
);

// update event image
eventRouter.post(
  '/update-image/:eventId',
  checkJwtExits,
  checkIfUserIsAdmin,
  multerUpload.single('eventImageFile'),
  updateEventImageController
);

// delete an event
eventRouter.delete(
  '/delete/:eventId',
  checkJwtExits,
  checkIfUserIsAdmin,
  deleteEventController
);
