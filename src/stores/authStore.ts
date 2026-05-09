import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { userService, UserResponse } from '../services/userService';
import { tokenStorage } from '../services/apiClient';

const AUTH_USER_KEY = '@menuPlanApp:user';

interface AuthStore {
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLoading: boolean;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  confirmEmail: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserResponse) => void;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  pendingEmail: null,

  login: async (email, password) => {
    const tokens = await authService.login(email, password);
    await tokenStorage.set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      idToken: tokens.idToken,
    });

    const user = await userService.getUser(tokens.userId);
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  register: async (displayName, email, password) => {
    await authService.register(email, password, displayName);
    set({ pendingEmail: email });
  },

  confirmEmail: async (email, code) => {
    await authService.confirm(email, code);
  },

  logout: async () => {
    try {
      const tokens = await tokenStorage.get();
      if (tokens?.accessToken) {
        await authService.logout(tokens.accessToken);
      }
    } catch {
      // サーバー側エラーでもローカルはクリア
    }
    await tokenStorage.clear();
    await AsyncStorage.removeItem(AUTH_USER_KEY);
    set({ isAuthenticated: false, user: null, pendingEmail: null });
  },

  updateUser: (user) => {
    set({ user });
    AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  loadAuth: async () => {
    try {
      const [tokens, savedUser] = await Promise.all([
        tokenStorage.get(),
        AsyncStorage.getItem(AUTH_USER_KEY),
      ]);

      if (tokens?.accessToken && savedUser) {
        set({ isAuthenticated: true, user: JSON.parse(savedUser), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
