import { Router } from 'express';
import {
  signinAdminUserController,
  signinStandardUserController,
  signupAdminUserController,
  signupStandardUserController,
} from '../controllers/auth.controller';
import {
  checkAdminUserSignupObjectValid,
  checkStandardUserSignupObjectValid,
  checkUserSigninObjectValid,
} from '../middleware/auth.middleware';

export const authRouter = Router();

// standard user signup
authRouter.post(
  '/signup/standard',
  checkStandardUserSignupObjectValid,
  signupStandardUserController
);

// standard user signin
authRouter.post(
  '/signin/standard',
  checkUserSigninObjectValid,
  signinStandardUserController
);

// admin user signup
authRouter.post(
  '/signup/admin',
  checkAdminUserSignupObjectValid,
  signinAdminUserController
);

// admin user signin
authRouter.post(
  '/signin/admin',
  checkUserSigninObjectValid,
  signupAdminUserController
);
