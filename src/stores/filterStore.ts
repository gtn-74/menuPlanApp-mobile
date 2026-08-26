import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { CategoryFilter, FilterState } from '../types';

const FILTER_STORAGE_KEY = '@menuPlanApp:filters';

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

  // フィルター設定をAsyncStorageから読み込み
  loadFilters: async () => {
    try {
      const savedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
      if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        // 新しいフィールドがない場合はデフォルト値を維持
        set({
          ...filters,
          visibleUserIds: filters.visibleUserIds ?? get().visibleUserIds,
          quickFilterUserIds: filters.quickFilterUserIds ?? get().quickFilterUserIds,
        });
      }
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  },

  // フィルター設定をAsyncStorageに保存
  saveFilters: async () => {
    try {
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
      await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save filters:', error);
    }
  },
}));
