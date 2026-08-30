import { create } from 'zustand';
import { localMenuRepository, type MenuRepository } from '@/features/menu/menuRepository';
import type { MenuItem } from '@/schemas/domain';
import type { MenuDraft } from '@/schemas/menu';

/**
 * 献立の状態。repository をラップし、UI は store 経由で読み書きする。
 * （API 化時は repo を差し替えるだけ。将来 TanStack Query へ移行しやすい粒度）
 */
interface MenuStore {
  items: MenuItem[];
  loaded: boolean;
  load: () => Promise<void>;
  addMenu: (draft: MenuDraft) => Promise<void>;
  updateMenu: (id: string, patch: Partial<MenuDraft>) => Promise<void>;
  removeMenu: (id: string) => Promise<void>;
}

const repo: MenuRepository = localMenuRepository;

export const useMenuStore = create<MenuStore>((set) => ({
  items: [],
  loaded: false,
  load: async () => {
    set({ items: await repo.getAll(), loaded: true });
  },
  addMenu: async (draft) => {
    const item = await repo.create(draft);
    set((state) => ({ items: [...state.items, item] }));
  },
  updateMenu: async (id, patch) => {
    set({ items: await repo.update(id, patch) });
  },
  removeMenu: async (id) => {
    set({ items: await repo.remove(id) });
  },
}));
