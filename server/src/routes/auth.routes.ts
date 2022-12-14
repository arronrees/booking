import { Router } from 'express';
import {
  signinUserController,
  signupUserController,
  verifyEmailController,
} from '../controllers/auth.controller';
import {
  checkUserSignupObjectValid,
  checkUserSigninObjectValid,
} from '../middleware/auth.middleware';

export const authRouter = Router();

// user signup
authRouter.post('/signup', checkUserSignupObjectValid, signupUserController);

// user signin
authRouter.post('/signin', checkUserSigninObjectValid, signinUserController);

// user verify email address
authRouter.post('/email/verify/:id/:token', verifyEmailController);
