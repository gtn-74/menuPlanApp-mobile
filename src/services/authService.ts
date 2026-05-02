import type { LoginResponse, RegisterResponse } from '../api/types';
import client from './apiClient';

export type { RegisterResponse, LoginResponse };

export const authService = {
  register: async (email: string, password: string, displayName: string): Promise<RegisterResponse> => {
    const res = await client.post<RegisterResponse>('/auth/register', { email, password, displayName });
    return res.data;
  },

  confirm: async (email: string, confirmationCode: string): Promise<void> => {
    await client.post('/auth/confirm', { email, confirmationCode });
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await client.post<LoginResponse>('/auth/login', { email, password });
    return res.data;
  },

  logout: async (accessToken: string): Promise<void> => {
    await client.post('/auth/logout', { accessToken });
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const res = await client.post<LoginResponse>('/auth/refresh', { refreshToken });
    return res.data;
  },
};
