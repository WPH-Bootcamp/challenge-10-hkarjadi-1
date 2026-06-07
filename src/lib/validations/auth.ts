import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid Email'),
  password: z.string().min(6, 'Password minimum 6 character'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Minimun 2 character'),
  email: z.string().email('Invalid Email'),
  phone: z.string().min(8, 'Minimum 8 number'),
  password: z.string().min(6, 'Password minimun 6 character'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
