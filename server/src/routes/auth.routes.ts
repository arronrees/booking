import { Router } from 'express';
import { signupController } from '../controllers/auth.controller';
import { checkSignupObjectValid } from '../middleware/auth.middleware';

export const authRouter = Router();

authRouter.post('/signup', checkSignupObjectValid, signupController);
