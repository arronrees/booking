import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

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
