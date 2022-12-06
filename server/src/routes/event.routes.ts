import { Router } from 'express';
import {
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
} from '../middleware/event.middleware';
import {
  createEventController,
  getAllEventsController,
} from '../controllers/event.controller';

export const eventRouter = Router();

// create new event
eventRouter.post(
  '/create/:adminUserId',
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
  createEventController
);

// get all events
eventRouter.get('/', getAllEventsController);
