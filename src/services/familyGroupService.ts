import client from './apiClient';

export interface FamilyGroupResponse {
  id: string;
  name: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
}

export interface InvitationResponse {
  token: string;
  expiresAt: string;
}

export const familyGroupService = {
  create: async (name: string, ownerId: string): Promise<FamilyGroupResponse> => {
    const res = await client.post<FamilyGroupResponse>('/family-groups', { name, ownerId });
    return res.data;
  },

  get: async (id: string): Promise<FamilyGroupResponse> => {
    const res = await client.get<FamilyGroupResponse>(`/family-groups/${id}`);
    return res.data;
  },

  invite: async (groupId: string, email: string): Promise<InvitationResponse> => {
    const res = await client.post<InvitationResponse>(`/family-groups/${groupId}/invite`, { email });
    return res.data;
  },

  join: async (token: string, userId: string): Promise<FamilyGroupResponse> => {
    const res = await client.post<FamilyGroupResponse>('/family-groups/join', { token, userId });
    return res.data;
  },
};
