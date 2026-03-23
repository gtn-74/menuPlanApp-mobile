// カラーテーマ定義
export const colors = {
  // メインカラー（オレンジ系）
  primary: "#FF9800",
  primaryLight: "#FFB74D",
  primaryDark: "#F57C00",

  // カテゴリーカラー
  menu: "#FF9800", // 献立 - オレンジ
  budget: "#4CAF50", // 家計簿 - グリーン
  event: "#2196F3", // 予定 - ブルー

  // 背景色
  background: "#FFFFFF",
  backgroundSecondary: "#F5F5F5",

  // テキストカラー
  text: "#333333",
  textSecondary: "#757575",
  textLight: "#BDBDBD",

  // ボーダー
  border: "#E0E0E0",

  // その他
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",

  // カレンダー
  selectedDay: "#FF9800",
  today: "#FFE0B2",

  // ドットカラー
  dots: {
    menu: "#FF9800",
    budget: "#4CAF50",
    personalEvent: "#2196F3",
    familyEvent: "#9C27B0",
    todo: "#E91E63",
  },
};

export type ColorKeys = keyof typeof colors;
