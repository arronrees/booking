import { Router } from 'express';
import {
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
} from '../middleware/event.middleware';
import {
  createEventController,
  deleteEventController,
  getAllEventsController,
} from '../controllers/event.controller';

export const eventRouter = Router();

// get all events
eventRouter.get('/', getAllEventsController);

// create new event
eventRouter.post(
  '/create/:adminUserId',
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
  createEventController
);

// delete an event
eventRouter.delete('/delete/:id', deleteEventController);
