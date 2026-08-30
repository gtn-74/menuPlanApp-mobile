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

export interface VersionedStorageOptions<S extends z.ZodType> {
  key: string;
  version: number;
  schema: S;
  /** 保存されている全体の既定値（未保存/復旧不能時に返す） */
  fallback: z.infer<S>;
  /** 旧 version のデータを現行形式へ変換（best-effort） */
  migrate?: (data: unknown, fromVersion: number) => unknown;
}

/**
 * ユーザー生成データ向けの type-safe な永続化ラッパ。
 * `createTypedStorage` と違い「壊れたら黙って破棄」しない：
 *  - `{ version, data }` エンベロープで保存
 *  - version 不一致は migrate を通す
 *  - それでも zod 検証に失敗したら、元データを別キーへ**バックアップ退避**してから fallback を返す
 *    （＝ユーザーデータのロストを最小化。後から復旧調査できる）
 */
export function createVersionedStorage<S extends z.ZodType>(opts: VersionedStorageOptions<S>) {
  type T = z.infer<S>;
  const { key, version, schema, fallback, migrate } = opts;
  return {
    async get(): Promise<T> {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (raw == null) return fallback;
        const envelope = JSON.parse(raw) as { version?: number; data?: unknown };
        let data = envelope?.data;
        const from = envelope?.version ?? 0;
        if (from !== version && migrate) {
          data = migrate(data, from);
        }
        const parsed = schema.safeParse(data);
        if (parsed.success) return parsed.data as T;
        // 復旧不能: 破棄せずバックアップしてから既定値で継続
        await AsyncStorage.setItem(`${key}:corrupt:${Date.now()}`, raw);
        console.warn(`[storage] ${key}: 壊れた値をバックアップして継続`, parsed.error.issues);
        return fallback;
      } catch (error) {
        console.warn(`[storage] ${key}: 読み込みに失敗しました`, error);
        return fallback;
      }
    },
    async set(value: T): Promise<void> {
      await AsyncStorage.setItem(key, JSON.stringify({ version, data: value }));
    },
  };
}
