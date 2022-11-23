import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';

const prisma = new PrismaClient();
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

app.get('/create', async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      name: 'Arron Rees',
      email: 'arron@email.com',
      password: 'password',
    },
  });

  res.json(user);
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).json({ error: err.message });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
