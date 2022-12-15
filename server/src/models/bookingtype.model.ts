import { z } from 'zod';

export const createBookingTypeModel = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: ' Name must be a string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: ' Description must be a string',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: ' Price must be a number',
  }),
  maxBookings: z.number({
    required_error: 'Max Bookings is required',
    invalid_type_error: ' Max Bookings must be a number',
  }),
});

export type CreateBookingTypeType = z.infer<typeof createBookingTypeModel>;

export const updateBookingTypeModel = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: ' Name must be a string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: ' Description must be a string',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: ' Price must be a number',
  }),
  maxBookings: z.number({
    required_error: 'Max Bookings is required',
    invalid_type_error: ' Max Bookings must be a number',
  }),
});

export type UpdateBookingTypeType = z.infer<typeof updateBookingTypeModel>;
