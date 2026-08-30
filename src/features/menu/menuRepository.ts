import { z } from 'zod';
import { type MenuItem, MenuItemSchema } from '@/schemas/domain';
import type { MenuDraft } from '@/schemas/menu';
import { createVersionedStorage } from '@/utils/storage';

/**
 * 献立データの入出力を抽象化する repository。
 * いまは AsyncStorage 実装（local-first）。API 到着時（#14）は同じ interface の
 * ApiMenuRepository を作って差し替えるだけで UI/store は不変。
 */
export interface MenuRepository {
  getAll(): Promise<MenuItem[]>;
  create(draft: MenuDraft): Promise<MenuItem>;
  update(id: string, patch: Partial<MenuDraft>): Promise<MenuItem[]>;
  remove(id: string): Promise<MenuItem[]>;
}

const MENUS_KEY = '@menuPlanApp:menus';

const storage = createVersionedStorage({
  key: MENUS_KEY,
  version: 1,
  schema: z.array(MenuItemSchema),
  fallback: [] as MenuItem[],
});

// クライアント生成 ID（※API 同期時にサーバID突合が必要になる点は設計docに記載）
const genId = () => `menu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const localMenuRepository: MenuRepository = {
  async getAll() {
    return storage.get();
  },

  async create(draft) {
    const item: MenuItem = {
      id: genId(),
      // TODO(#14): 認証ユーザー/家族グループに接続。現状は単一端末の既定値。
      userId: 'user-1',
      familyGroupId: 'family-1',
      createdAt: new Date().toISOString(),
      ...draft,
    };
    const items = await storage.get();
    await storage.set([...items, item]);
    return item;
  },

  async update(id, patch) {
    const items = await storage.get();
    const next = items.map((m) => (m.id === id ? { ...m, ...patch } : m));
    await storage.set(next);
    return next;
  },

  async remove(id) {
    const items = await storage.get();
    const next = items.filter((m) => m.id !== id);
    await storage.set(next);
    return next;
  },
};
