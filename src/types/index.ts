// 型定義

import type { NavigatorScreenParams } from '@react-navigation/native';

// ドメインデータ型は zod スキーマ（src/schemas/domain.ts）から導出する単一の真実源。
// 外部入力の検証にはスキーマ本体（*Schema）を使う。
export type {
  BudgetItem,
  CategoryFilter,
  DayData,
  Event,
  FilterState,
  MenuItem,
  TodoItem,
  User,
} from '@/schemas/domain';

// --- 以下は UI / ナビゲーション用の型（外部データではないので手書きのまま） ---

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
  ForgotPassword: undefined;
};

// メインスタック（タブ配下＋モーダル）のナビゲーション型
export type MainStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Profile: undefined;
};

// ボトムタブのナビゲーション型
export type MainTabParamList = {
  Calendar: undefined;
  Menu: undefined;
  Budget: undefined;
  Schedule: undefined;
};
