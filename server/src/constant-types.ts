import { User } from '@prisma/client';

export interface JsonApiResponse {
  success: boolean;
  data?: [] | {} | string;
  error?: string;
}

export interface ResLocals {
  user: User;
}
