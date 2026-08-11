import { z } from 'zod';

export const cuilSchema = z.string().regex(/^\d{2}-\d{8}-\d{1}$/, 'Invalid CUIL format');

export const emailSchema = z.string().email('Invalid email format');

export const phoneSchema = z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number');

export type ValidationError = {
  path: string;
  message: string;
};

export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): ValidationError[] => {
  try {
    schema.parse(data);
    return [];
  } catch (e) {
    if (e instanceof z.ZodError) {
      return e.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
    }
    return [{ path: '', message: 'Unknown validation error' }];
  }
};