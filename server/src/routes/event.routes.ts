import { Router } from 'express';
import { createEventController } from '../controllers/event.controller';
import {
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
} from '../middleware/event.middleware';

export const eventRouter = Router();

// create new event
eventRouter.post(
  '/create/:adminUserId',
  checkAdminUserIdSentIsValid,
  checkCreateEventObjectValid,
  createEventController
);
