import { Router } from 'express';
import { getSingleUser } from '../controllers/user.controller';

export const userRouter = Router();

// get user information
userRouter.get('/:userId', getSingleUser);
