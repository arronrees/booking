import { z } from 'zod';

export const createAddressModel = z.object({
  addressLine1: z.string({
    required_error: 'Address Line 1 is required',
    invalid_type_error: 'Address must be a string',
  }),
  addressLine2: z.string({
    invalid_type_error: 'Address Line 2 must be a string or null',
  }),
  town: z.string({
    required_error: 'Town is required',
    invalid_type_error: 'Town must be a string',
  }),
  county: z.string({ invalid_type_error: 'County must be a string or null' }),
  postcode: z.string({
    required_error: 'Postcode is required',
    invalid_type_error: 'Postcode must be a string',
  }),
  country: z.string({
    required_error: 'Country is required',
    invalid_type_error: 'Country must be a string',
  }),
});

export type CreateAddressType = z.infer<typeof createAddressModel>;
