import AsyncStorage from '@react-native-async-storage/async-storage';
import type { z } from 'zod';

/**
 * zod スキーマで検証する型付き AsyncStorage ラッパ。
 * get は境界で `safeParse` し、壊れた/古い値は無視して null を返す（アプリを落とさない）。
 * 型は `z.infer<S>` で導出され、set も検証済みの型しか受け付けない。
 */
export function createTypedStorage<S extends z.ZodType>(key: string, schema: S) {
  type T = z.infer<S>;
  return {
    async get(): Promise<T | null> {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (raw == null) return null;
        const parsed = schema.safeParse(JSON.parse(raw));
        if (!parsed.success) {
          console.warn(`[storage] ${key}: 壊れた値を無視しました`, parsed.error.issues);
          return null;
        }
        return parsed.data as T;
      } catch (error) {
        console.warn(`[storage] ${key}: 読み込みに失敗しました`, error);
        return null;
      }
    },
    async set(value: T): Promise<void> {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    async remove(): Promise<void> {
      await AsyncStorage.removeItem(key);
    },
  };
}
