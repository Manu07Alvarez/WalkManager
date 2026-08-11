import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerWalkerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  cuil: z.string().min(11, 'CUIL must be at least 11 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterWalkerInput = z.infer<typeof registerWalkerSchema>;

export async function loginUser(input: LoginInput) {
  return { access_token: 'mock-jwt-token', token_type: 'Bearer' };
}
