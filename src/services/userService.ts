import type { UserResponse, UpdateProfileRequest } from '../api/types';
import client from './apiClient';

export type { UserResponse, UpdateProfileRequest };

export const userService = {
  getUser: async (userId: string): Promise<UserResponse> => {
    const res = await client.get<UserResponse>(`/users/${userId}`);
    return res.data;
  },

  updateProfile: async (userId: string, data: UpdateProfileRequest): Promise<UserResponse> => {
    const res = await client.patch<UserResponse>(`/users/${userId}`, data);
    return res.data;
  },

  deleteAccount: async (userId: string): Promise<void> => {
    await client.delete(`/users/${userId}`);
  },
};
