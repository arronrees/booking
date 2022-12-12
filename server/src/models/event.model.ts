import { z } from 'zod';

export const createEventModel = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Incorrect date format',
  }),
  type: z.enum(['MUSIC', 'FESTIVAL', 'THEATRE', 'SPORT', 'OTHER']),
  public: z.boolean({
    required_error: 'Public is required',
    invalid_type_error: 'Public must be a boolean',
  }),
});

export type CreateEventType = z.infer<typeof createEventModel>;
