import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@menuPlanApp:auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  login: async (email: string, _password: string) => {
    // モック認証: どんな値でもログイン成功
    const user: User = {
      id: 'user-1',
      name: email.split('@')[0],
      email,
    };
    set({ isAuthenticated: true, user });
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user }));
    return true;
  },

  signup: async (name: string, email: string, _password: string) => {
    // モック登録: 常に成功
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
    };
    // サインアップ後は自動ログインしない（LoginScreenに戻る）
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated: false, user: null }));
    return true;
  },

  logout: async () => {
    set({ isAuthenticated: false, user: null });
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  },

  loadAuth: async () => {
    try {
      const saved = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const { isAuthenticated, user } = JSON.parse(saved);
        set({ isAuthenticated, user, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
      set({ isLoading: false });
    }
  },
}));
