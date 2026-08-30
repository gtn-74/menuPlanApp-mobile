import { create } from 'zustand';
import { FilterStateSchema } from '@/schemas/domain';
import type { CategoryFilter, FilterState } from '@/types';
import { createTypedStorage } from '@/utils/storage';

const FILTER_STORAGE_KEY = '@menuPlanApp:filters';
const filterStorage = createTypedStorage(FILTER_STORAGE_KEY, FilterStateSchema);

interface FilterStore extends FilterState {
  setCategory: (category: CategoryFilter) => void;
  toggleMenu: () => void;
  toggleBudget: () => void;
  togglePersonalEvents: () => void;
  toggleFamilyEvents: () => void;
  toggleUserVisibility: (userId: string) => void;
  setVisibleUsers: (userIds: string[]) => void;
  toggleQuickFilterUser: (userId: string) => void;
  loadFilters: () => Promise<void>;
  saveFilters: () => Promise<void>;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  // 初期状態（デフォルトは全てtrue）
  showMenu: true,
  showBudget: true,
  showPersonalEvents: true,
  showFamilyEvents: true,
  showTodo: true,
  selectedCategory: 'all',
  visibleUserIds: ['user-1', 'user-2', 'user-3'], // デフォルトは全員表示
  quickFilterUserIds: ['user-1', 'user-2', 'user-3'], // クイックフィルターに全員表示

  // カテゴリ選択
  setCategory: (category: CategoryFilter) => {
    const filters = {
      all: {
        showMenu: true,
        showBudget: true,
        showPersonalEvents: true,
        showFamilyEvents: true,
        showTodo: true,
      },
      menu: {
        showMenu: true,
        showBudget: false,
        showPersonalEvents: false,
        showFamilyEvents: false,
        showTodo: false,
      },
      budget: {
        showMenu: false,
        showBudget: true,
        showPersonalEvents: false,
        showFamilyEvents: false,
        showTodo: false,
      },
      todo: {
        showMenu: false,
        showBudget: false,
        showPersonalEvents: false,
        showFamilyEvents: false,
        showTodo: true,
      },
    };
    set({ selectedCategory: category, ...filters[category] });
    get().saveFilters();
  },

  // 献立表示切り替え
  toggleMenu: () => {
    set((state) => ({ showMenu: !state.showMenu }));
    get().saveFilters();
  },

  // 家計簿表示切り替え
  toggleBudget: () => {
    set((state) => ({ showBudget: !state.showBudget }));
    get().saveFilters();
  },

  // 個人予定表示切り替え
  togglePersonalEvents: () => {
    set((state) => ({ showPersonalEvents: !state.showPersonalEvents }));
    get().saveFilters();
  },

  // 家族予定表示切り替え
  toggleFamilyEvents: () => {
    set((state) => ({ showFamilyEvents: !state.showFamilyEvents }));
    get().saveFilters();
  },

  // ユーザー表示切り替え
  toggleUserVisibility: (userId: string) => {
    set((state) => {
      const isVisible = state.visibleUserIds.includes(userId);
      const newVisibleUserIds = isVisible
        ? state.visibleUserIds.filter((id) => id !== userId)
        : [...state.visibleUserIds, userId];
      return { visibleUserIds: newVisibleUserIds };
    });
    get().saveFilters();
  },

  // 表示ユーザーを設定
  setVisibleUsers: (userIds: string[]) => {
    set({ visibleUserIds: userIds });
    get().saveFilters();
  },

  // クイックフィルターのユーザー表示切り替え
  toggleQuickFilterUser: (userId: string) => {
    set((state) => {
      const isVisible = state.quickFilterUserIds.includes(userId);
      const newQuickFilterUserIds = isVisible
        ? state.quickFilterUserIds.filter((id) => id !== userId)
        : [...state.quickFilterUserIds, userId];
      return { quickFilterUserIds: newQuickFilterUserIds };
    });
    get().saveFilters();
  },

  // フィルター設定を AsyncStorage から読み込み（境界でスキーマ検証）
  loadFilters: async () => {
    // 壊れた/古い形（必須フィールド欠損など）は get() が null を返し、既定値が維持される
    const saved = await filterStorage.get();
    if (saved) {
      set(saved);
    }
  },

  // フィルター設定を AsyncStorage に保存
  saveFilters: async () => {
    const {
      showMenu,
      showBudget,
      showPersonalEvents,
      showFamilyEvents,
      showTodo,
      selectedCategory,
      visibleUserIds,
      quickFilterUserIds,
    } = get();
    const filters: FilterState = {
      showMenu,
      showBudget,
      showPersonalEvents,
      showFamilyEvents,
      showTodo,
      selectedCategory,
      visibleUserIds,
      quickFilterUserIds,
    };
    await filterStorage.set(filters);
  },
}));
