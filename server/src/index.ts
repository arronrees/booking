import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import { authRouter } from './routes/auth.routes';
import { eventRouter } from './routes/event.routes';
import { userRouter } from './routes/user.routes';
import { bookingTypeRouter } from './routes/bookingtype.routes';
import { checkJwtExits } from './middleware/auth.middleware';

export const prismaDB = new PrismaClient({
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn'],
});

const app = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// reset user on locals
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.user = null;

  next();
});

// routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/users', userRouter);
app.use('/api/bookingtype', bookingTypeRouter);

app.get('/', async (req: Request, res: Response) => {
  res.send('home');
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).json({ error: err.message });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
