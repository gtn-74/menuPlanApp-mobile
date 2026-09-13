import { beforeEach, describe, expect, it, vi } from 'vitest';
import { quickAddToDraft } from '@/schemas/menu';

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

import { useMenuStore } from './menuStore';

const reset = () => {
  mem.clear();
  useMenuStore.setState({ items: [], loaded: false });
};

beforeEach(reset);

/**
 * 献立画面（日別/週別）が実際に叩くのは store のこの4メソッド。
 * repository 側の CRUD は menuRepository.test.ts が見るので、ここは
 * 「store の items が UI から見て期待どおり動くか」に絞る。
 */
describe('useMenuStore', () => {
  it('初期状態は空で未ロード', () => {
    expect(useMenuStore.getState().items).toEqual([]);
    expect(useMenuStore.getState().loaded).toBe(false);
  });

  it('load で永続データを読み込み、loaded が立つ', async () => {
    await useMenuStore.getState().addMenu(quickAddToDraft('2026-01-05', 'カレー'));
    // 別セッションを模して state だけ捨て、ストレージから読み直す
    useMenuStore.setState({ items: [], loaded: false });

    await useMenuStore.getState().load();

    expect(useMenuStore.getState().loaded).toBe(true);
    expect(useMenuStore.getState().items.map((m) => m.name)).toEqual(['カレー']);
  });

  it('addMenu はクイック追加の draft をそのまま1件に増やす', async () => {
    await useMenuStore.getState().addMenu(quickAddToDraft('2026-01-05', 'カレー'));

    const items = useMenuStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]?.date).toBe('2026-01-05');
    expect(items[0]?.name).toBe('カレー');
    // 予算未入力は 0。合計計算で NaN にならないことがここの主眼
    expect(items[0]?.budget).toBe(0);
  });

  it('updateMenu は該当1件だけを書き換える', async () => {
    await useMenuStore.getState().addMenu(quickAddToDraft('2026-01-05', 'カレー'));
    await useMenuStore.getState().addMenu(quickAddToDraft('2026-01-06', 'サラダ'));
    const target = useMenuStore.getState().items[0];
    expect(target).toBeDefined();

    await useMenuStore.getState().updateMenu(target?.id ?? '', { budget: 800 });

    const items = useMenuStore.getState().items;
    expect(items).toHaveLength(2);
    expect(items.find((m) => m.id === target?.id)?.budget).toBe(800);
    expect(items.find((m) => m.name === 'サラダ')?.budget).toBe(0);
  });

  it('removeMenu は該当1件だけを消す', async () => {
    await useMenuStore.getState().addMenu(quickAddToDraft('2026-01-05', 'カレー'));
    await useMenuStore.getState().addMenu(quickAddToDraft('2026-01-06', 'サラダ'));
    const target = useMenuStore.getState().items[0];

    await useMenuStore.getState().removeMenu(target?.id ?? '');

    expect(useMenuStore.getState().items.map((m) => m.name)).toEqual(['サラダ']);
  });

  it('変更は永続化され、load し直しても残る', async () => {
    await useMenuStore.getState().addMenu(quickAddToDraft('2026-01-05', 'カレー'));
    const target = useMenuStore.getState().items[0];
    await useMenuStore.getState().updateMenu(target?.id ?? '', { name: 'カレーライス' });

    useMenuStore.setState({ items: [], loaded: false });
    await useMenuStore.getState().load();

    expect(useMenuStore.getState().items.map((m) => m.name)).toEqual(['カレーライス']);
  });
});
