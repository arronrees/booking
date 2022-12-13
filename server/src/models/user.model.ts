import { z } from 'zod';

export const createUserModel = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  telephone: z.string({
    required_error: 'Telephone is required',
    invalid_type_error: 'Telephone must be a string',
  }),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
  age: z.number({
    required_error: 'Age is required',
    invalid_type_error: 'Age must be a number',
  }),
});

export type CreateUserType = z.infer<typeof createUserModel>;

export const signinUserModel = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});

export type SigninUserType = z.infer<typeof signinUserModel>;

export const updateUserModel = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  telephone: z.string({
    required_error: 'Telephone is required',
    invalid_type_error: 'Telephone must be a string',
  }),
  age: z.number({
    required_error: 'Age is required',
    invalid_type_error: 'Age must be a number',
  }),
});

export type UpdateUserType = z.infer<typeof updateUserModel>;
