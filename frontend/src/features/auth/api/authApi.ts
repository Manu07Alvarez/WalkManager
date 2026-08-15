import { z } from 'zod';
import { apiClient } from '../../../shared/api';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const registerWalkerSchema = z.object({
  full_name: z.string().min(1, 'Nombre completo requerido'),
  email: z.string().email('Email inválido'),
  phone_number: z.string().min(1, 'Teléfono requerido'),
  cuil: z.string().min(11, 'CUIL debe contener al menos 11 caracteres'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterWalkerInput = z.infer<typeof registerWalkerSchema>;

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: 'Customer' | 'DogWalker' | 'Moderator';
  status: string;
}

export interface AuthResponseData {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export async function loginUser(input: LoginInput): Promise<AuthResponseData> {
  const response = await apiClient.post('/v1/auth/login', input);
  return response.data;
}

export async function registerWalker(input: RegisterWalkerInput): Promise<AuthResponseData> {
  const response = await apiClient.post('/v1/auth/register/walker', input);
  return response.data;
}

export async function registerCustomer(input: RegisterWalkerInput): Promise<AuthResponseData> {
  const response = await apiClient.post('/v1/auth/register/customer', input);
  return response.data;
}
