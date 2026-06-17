// 型定義

export interface MenuItem {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  budget: number;
  ingredients: string[];
  photos: string[];
  userId: string;
  familyGroupId: string;
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  amount: number; // 負の値は支出
  description: string;
  userId: string;
  familyGroupId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string; // HH:mm
  type: "personal" | "family";
  userId: string;
  familyGroupId?: string;
  createdAt: string;
}

export interface TodoItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  userId: string; // 作成者
  assignedTo?: string; // 割り振り先ユーザーID
  familyGroupId?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface DayData {
  date: string;
  menus: MenuItem[];
  budgets: BudgetItem[];
  events: Event[];
  todos: TodoItem[];
}

export type CategoryFilter = "all" | "menu" | "budget" | "todo";

export interface FilterState {
  showMenu: boolean;
  showBudget: boolean;
  showPersonalEvents: boolean;
  showFamilyEvents: boolean;
  showTodo: boolean;
  selectedCategory: CategoryFilter;
  visibleUserIds: string[]; // 表示するユーザーのID
  quickFilterUserIds: string[]; // クイックフィルターに表示するユーザーのID
}

export interface MarkedDate {
  dots?: Array<{
    key: string;
    color: string;
  }>;
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
}

export type MarkedDates = {
  [date: string]: MarkedDate;
};

// 認証スタックのナビゲーション型
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ConfirmEmail: { email: string; password: string };
  ForgotPassword: undefined;
};

// オンボーディングスタックのナビゲーション型
export type OnboardingStackParamList = {
  Onboarding: undefined;
  GroupSetup: undefined;
  JoinGroup: undefined;
};

// メインスタックのナビゲーション型
export type MainStackParamList = {
  Main: undefined;
  Profile: undefined;
};

// API レスポンス型（openapi.yaml より）
export interface ApiUser {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  familyGroupId: string | null;
  createdAt: string;
  updatedAt: string;
}
