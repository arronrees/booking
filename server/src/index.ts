import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import { authRouter } from './routes/auth.routes';

export const prismaDB = new PrismaClient({
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn'],
});

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/auth', authRouter);

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
