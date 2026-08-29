import { z } from 'zod';
import { create } from 'zustand';
import { createTypedStorage } from '../utils/storage';

const AUTH_STORAGE_KEY = '@menuPlanApp:auth';

const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});
type User = z.infer<typeof AuthUserSchema>;

// AsyncStorage に保存する認証状態の形（境界で検証する）
const AuthStateSchema = z.object({
  isAuthenticated: z.boolean(),
  user: AuthUserSchema.nullable(),
});

const authStorage = createTypedStorage(AUTH_STORAGE_KEY, AuthStateSchema);

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  login: async (email: string, _password: string) => {
    // モック認証: どんな値でもログイン成功
    const user: User = {
      id: 'user-1',
      name: email.split('@')[0] ?? email,
      email,
    };
    set({ isAuthenticated: true, user });
    await authStorage.set({ isAuthenticated: true, user });
    return true;
  },

  signup: async (_name: string, _email: string, _password: string) => {
    // モック登録: 常に成功。サインアップ後は自動ログインしない（LoginScreenに戻る）
    await authStorage.set({ isAuthenticated: false, user: null });
    return true;
  },

  logout: async () => {
    set({ isAuthenticated: false, user: null });
    await authStorage.remove();
  },

  loadAuth: async () => {
    const saved = await authStorage.get();
    if (saved) {
      set({ isAuthenticated: saved.isAuthenticated, user: saved.user, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
