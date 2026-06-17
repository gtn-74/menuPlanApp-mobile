import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
const TOKEN_KEY = '@menuPlanApp:tokens';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

export const tokenStorage = {
  get: async (): Promise<StoredTokens | null> => {
    const raw = await AsyncStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  set: async (tokens: StoredTokens) => {
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  },
  clear: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const tokens = await tokenStorage.get();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(client(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const tokens = await tokenStorage.get();
      if (!tokens?.refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken: tokens.refreshToken,
      });

      const newTokens: StoredTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? tokens.refreshToken,
        idToken: data.idToken ?? tokens.idToken,
      };
      await tokenStorage.set(newTokens);

      refreshQueue.forEach((cb) => cb(newTokens.accessToken));
      refreshQueue = [];

      original.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      return client(original);
    } catch {
      refreshQueue = [];
      await tokenStorage.clear();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;
