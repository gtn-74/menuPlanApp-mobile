import client from './apiClient';

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
  userId: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await client.post<RegisterResponse>('/auth/register', data);
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
