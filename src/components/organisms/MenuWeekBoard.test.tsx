/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import type { DayMenus } from '@/features/menu/menuSelectors';
import type { MenuItem } from '@/schemas/domain';
import { MenuWeekBoard } from './MenuWeekBoard';

const menu = (id: string, date: string, name: string): MenuItem => ({
  id,
  date,
  name,
  budget: 0,
  ingredients: [],
  photos: [],
  userId: 'user-1',
  familyGroupId: 'family-1',
  createdAt: '2026-01-04T10:00:00Z',
});

// 2026-01-04(日) 〜 2026-01-10(土)
const WEEK = [
  '2026-01-04',
  '2026-01-05',
  '2026-01-06',
  '2026-01-07',
  '2026-01-08',
  '2026-01-09',
  '2026-01-10',
];

const days: DayMenus[] = WEEK.map((date) => ({
  date,
  menus: date === '2026-01-05' ? [menu('1', date, 'カレー')] : [],
}));

const setup = (overrides: Partial<React.ComponentProps<typeof MenuWeekBoard>> = {}) => {
  const props = {
    days,
    today: '2026-01-05',
    onQuickAdd: jest.fn(),
    onPressMenu: jest.fn(),
    onDeleteMenu: jest.fn(),
    onPressDate: jest.fn(),
    ...overrides,
  };
  render(<MenuWeekBoard {...props} />);
  return props;
};

describe('MenuWeekBoard (organism)', () => {
  it('献立が0件の日も含めて7列すべて描く', () => {
    setup();
    for (const date of WEEK) {
      expect(screen.getByTestId(`week-column-${date}`)).toBeTruthy();
    }
  });

  it('列ヘッダに曜日と M/D を出す', () => {
    setup();
    expect(screen.getByText('日')).toBeTruthy();
    expect(screen.getByText('土')).toBeTruthy();
    expect(screen.getByText('1/4')).toBeTruthy();
    expect(screen.getByText('1/10')).toBeTruthy();
  });

  it('その日の献立を対応する列に出す', () => {
    setup();
    expect(screen.getByText('カレー')).toBeTruthy();
  });

  it('列ヘッダのタップで onPressDate にその日付が渡る', () => {
    const { onPressDate } = setup();
    fireEvent.press(screen.getByTestId('week-column-header-2026-01-07'));
    expect(onPressDate).toHaveBeenCalledWith('2026-01-07');
  });

  it('「追加」を押すまで入力欄は出ない', () => {
    setup();
    expect(screen.queryByTestId('week-quick-add-2026-01-06')).toBeNull();
    fireEvent.press(screen.getByTestId('week-add-2026-01-06'));
    expect(screen.getByTestId('week-quick-add-2026-01-06')).toBeTruthy();
  });

  it('入力欄は同時に1列だけ開く（別の列を開くと前の列は閉じる）', () => {
    setup();
    fireEvent.press(screen.getByTestId('week-add-2026-01-06'));
    fireEvent.press(screen.getByTestId('week-add-2026-01-08'));
    expect(screen.getByTestId('week-quick-add-2026-01-08')).toBeTruthy();
    expect(screen.queryByTestId('week-quick-add-2026-01-06')).toBeNull();
  });

  it('クイック追加で onQuickAdd に日付と料理名が渡る', () => {
    const { onQuickAdd } = setup();
    fireEvent.press(screen.getByTestId('week-add-2026-01-06'));
    fireEvent.changeText(screen.getByTestId('week-quick-add-2026-01-06'), '肉じゃが');
    fireEvent.press(screen.getByTestId('week-quick-add-2026-01-06-submit'));
    expect(onQuickAdd).toHaveBeenCalledWith('2026-01-06', '肉じゃが');
  });

  it('献立のタップ/削除がそれぞれのハンドラへ届く', () => {
    const { onPressMenu, onDeleteMenu } = setup();
    fireEvent.press(screen.getByTestId('menu-card-1'));
    expect(onPressMenu).toHaveBeenCalledWith(days[1]?.menus[0]);

    fireEvent.press(screen.getByTestId('menu-card-1-delete'));
    expect(onDeleteMenu).toHaveBeenCalledWith(days[1]?.menus[0]);
  });
});
