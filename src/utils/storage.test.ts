import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

// vitest(node) 用のインメモリ AsyncStorage モック
const { mem } = vi.hoisted(() => ({ mem: new Map<string, string>() }));
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: async (k: string) => mem.get(k) ?? null,
    setItem: async (k: string, v: string) => {
      mem.set(k, v);
    },
    removeItem: async (k: string) => {
      mem.delete(k);
    },
  },
}));

import { createVersionedStorage } from './storage';

const schema = z.array(z.object({ id: z.string() }));
const make = (extra = {}) =>
  createVersionedStorage({ key: 'k', version: 1, schema, fallback: [], ...extra });

beforeEach(() => mem.clear());

describe('createVersionedStorage', () => {
  it('未保存なら fallback を返す', async () => {
    expect(await make().get()).toEqual([]);
  });

  it('set → get のラウンドトリップ', async () => {
    const s = make();
    await s.set([{ id: 'a' }]);
    expect(await s.get()).toEqual([{ id: 'a' }]);
    // エンベロープ形式で保存されている
    expect(JSON.parse(mem.get('k') as string)).toEqual({ version: 1, data: [{ id: 'a' }] });
  });

  it('壊れた値は破棄せず corrupt キーへ退避して fallback', async () => {
    mem.set('k', JSON.stringify({ version: 1, data: [{ nope: 1 }] })); // schema 不一致
    expect(await make().get()).toEqual([]);
    expect([...mem.keys()].some((x) => x.startsWith('k:corrupt:'))).toBe(true);
  });

  it('version 不一致は migrate を通す', async () => {
    mem.set('k', JSON.stringify({ version: 0, data: [{ legacyId: 'x' }] }));
    const s = make({
      migrate: (data: unknown) => (data as { legacyId: string }[]).map((d) => ({ id: d.legacyId })),
    });
    expect(await s.get()).toEqual([{ id: 'x' }]);
  });
});
