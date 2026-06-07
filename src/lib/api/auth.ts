import { api } from './axios';

export type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

export type AuthData = {
  token: string;
  user?: AuthUser;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: AuthData;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const response = await api.post<AuthResponse>('/api/auth/login', payload);

  return response.data.data;
}

export async function register(payload: RegisterPayload) {
  const response = await api.post<AuthResponse>('/api/auth/register', payload);

  return response.data.data;
}

export async function updateProfile(data: {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}) {
  const res = await api.put('/auth/profile', data);
  return res.data;
}

export type ProfileResponse = {
  success: boolean;
  message: string;
  data: AuthUser;
};

export async function getProfile() {
  const response = await api.get<ProfileResponse>('/api/auth/profile');

  return response.data.data;
}
