/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import type { MenuItem } from '@/schemas/domain';
import { MenuDayBoard } from './MenuDayBoard';

const menu = (id: string, name: string, budget = 0): MenuItem => ({
  id,
  date: '2026-01-05',
  name,
  budget,
  ingredients: [],
  photos: [],
  userId: 'user-1',
  familyGroupId: 'family-1',
  createdAt: `2026-01-04T10:00:0${id}Z`,
});

const setup = (menus: MenuItem[]) => {
  const props = {
    date: '2026-01-05',
    menus,
    onQuickAdd: jest.fn(),
    onPressMenu: jest.fn(),
    onDeleteMenu: jest.fn(),
    onAddWithDetails: jest.fn(),
  };
  render(<MenuDayBoard {...props} />);
  return props;
};

describe('MenuDayBoard (organism)', () => {
  it('日付を「M月D日（曜）」で表示する', () => {
    setup([]);
    expect(screen.getByText('1月5日（月）')).toBeTruthy();
  });

  it('献立が無いときは空状態を出す', () => {
    setup([]);
    expect(screen.getByText('この日の献立はまだありません')).toBeTruthy();
    expect(screen.getByText('未登録')).toBeTruthy();
  });

  it('献立の件数と予算合計を出す', () => {
    setup([menu('1', 'カレー', 800), menu('2', 'サラダ', 200)]);
    expect(screen.getByText('2品 ・ 合計 ¥1,000')).toBeTruthy();
  });

  it('予算が全て未入力なら合計を出さない', () => {
    setup([menu('1', 'カレー'), menu('2', 'サラダ')]);
    expect(screen.getByText('2品')).toBeTruthy();
  });

  it('献立を並べて表示する', () => {
    setup([menu('1', 'カレー'), menu('2', 'サラダ')]);
    expect(screen.getByText('カレー')).toBeTruthy();
    expect(screen.getByText('サラダ')).toBeTruthy();
  });

  it('献立のタップで onPressMenu にその献立が渡る', () => {
    const items = [menu('1', 'カレー')];
    const { onPressMenu } = setup(items);
    fireEvent.press(screen.getByTestId('menu-card-1'));
    expect(onPressMenu).toHaveBeenCalledWith(items[0]);
  });

  it('削除アイコンのタップで onDeleteMenu にその献立が渡る', () => {
    const items = [menu('1', 'カレー')];
    const { onDeleteMenu } = setup(items);
    fireEvent.press(screen.getByTestId('menu-card-1-delete'));
    expect(onDeleteMenu).toHaveBeenCalledWith(items[0]);
  });

  it('クイック追加で onQuickAdd に料理名が渡る', () => {
    const { onQuickAdd } = setup([]);
    fireEvent.changeText(screen.getByTestId('day-quick-add'), '肉じゃが');
    fireEvent.press(screen.getByTestId('day-quick-add-submit'));
    expect(onQuickAdd).toHaveBeenCalledWith('肉じゃが');
  });

  it('詳細入力の導線で onAddWithDetails が呼ばれる', () => {
    const { onAddWithDetails } = setup([]);
    fireEvent.press(screen.getByTestId('day-add-with-details'));
    expect(onAddWithDetails).toHaveBeenCalledTimes(1);
  });
});
