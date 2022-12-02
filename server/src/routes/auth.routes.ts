import { Router } from 'express';
import {
  signinController,
  signupController,
} from '../controllers/auth.controller';
import {
  checkSigninObjectValid,
  checkSignupObjectValid,
} from '../middleware/auth.middleware';

export const authRouter = Router();

authRouter.post('/signup', checkSignupObjectValid, signupController);

authRouter.post('/signin', checkSigninObjectValid, signinController);
