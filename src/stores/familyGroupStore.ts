import { create } from 'zustand';
import { familyGroupService, FamilyGroupResponse } from '../services/familyGroupService';
import { userService } from '../services/userService';
import { useAuthStore } from './authStore';

interface FamilyGroupStore {
  group: FamilyGroupResponse | null;
  isLoading: boolean;
  createGroup: (name: string) => Promise<void>;
  joinGroup: (token: string) => Promise<void>;
  loadGroup: () => Promise<void>;
}

export const useFamilyGroupStore = create<FamilyGroupStore>((set) => ({
  group: null,
  isLoading: false,

  createGroup: async (name) => {
    set({ isLoading: true });
    try {
      const group = await familyGroupService.create(name);
      // ユーザー情報を再取得して familyGroupId を反映
      const user = useAuthStore.getState().user;
      if (user) {
        const updated = await userService.getUser(user.userId);
        useAuthStore.getState().updateUser(updated);
      }
      set({ group, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  joinGroup: async (token) => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('ログインが必要です');

      const group = await familyGroupService.join(token, user.userId);
      const updated = await userService.getUser(user.userId);
      useAuthStore.getState().updateUser(updated);
      set({ group, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  loadGroup: async () => {
    const user = useAuthStore.getState().user;
    if (!user?.familyGroupId) return;
    set({ isLoading: true });
    try {
      const group = await familyGroupService.get(user.familyGroupId);
      set({ group, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
