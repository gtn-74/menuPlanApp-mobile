import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MenuDraft } from '@/schemas/menu';

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

import { localMenuRepository as repo } from './menuRepository';

const draft = (name: string): MenuDraft => ({
  date: '2026-01-10',
  name,
  budget: 800,
  ingredients: ['肉', '玉ねぎ'],
  photos: [],
});

beforeEach(() => mem.clear());

describe('localMenuRepository', () => {
  it('初期は空', async () => {
    expect(await repo.getAll()).toEqual([]);
  });

  it('create で id/userId/createdAt が付与され保存される', async () => {
    const item = await repo.create(draft('カレー'));
    expect(item.id).toMatch(/^menu-/);
    expect(item.userId).toBe('user-1');
    expect(item.createdAt).not.toBe('');
    expect(item.name).toBe('カレー');
    const all = await repo.getAll();
    expect(all).toHaveLength(1);
    expect(all[0]?.name).toBe('カレー');
  });

  it('update は該当 id だけ変更', async () => {
    const a = await repo.create(draft('A'));
    await repo.create(draft('B'));
    const next = await repo.update(a.id, { name: 'A2', budget: 999 });
    const updated = next.find((m) => m.id === a.id);
    expect(updated?.name).toBe('A2');
    expect(updated?.budget).toBe(999);
    expect(next).toHaveLength(2);
  });

  it('remove で削除', async () => {
    const a = await repo.create(draft('A'));
    await repo.create(draft('B'));
    const next = await repo.remove(a.id);
    expect(next).toHaveLength(1);
    expect(next.some((m) => m.id === a.id)).toBe(false);
  });

  it('保存内容は再取得で永続（別呼び出しでも読める）', async () => {
    await repo.create(draft('永続'));
    expect((await repo.getAll()).map((m) => m.name)).toContain('永続');
  });
});
