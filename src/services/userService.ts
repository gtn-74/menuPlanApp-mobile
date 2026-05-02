import client from './apiClient';

export interface UserResponse {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  familyGroupId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  avatarUrl?: string;
}

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
