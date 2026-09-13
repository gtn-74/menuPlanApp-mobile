/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import type { MenuItem } from '@/schemas/domain';
import { MenuCard } from './MenuCard';

const menu = (overrides: Partial<MenuItem> = {}): MenuItem => ({
  id: 'm1',
  date: '2026-01-05',
  name: 'カレー',
  budget: 800,
  ingredients: ['肉', '玉ねぎ', 'じゃがいも', 'にんじん'],
  photos: [],
  userId: 'user-1',
  familyGroupId: 'family-1',
  createdAt: '2026-01-04T10:00:00Z',
  ...overrides,
});

/**
 * molecule のテスト観点:
 *  - props（料理名・予算・材料）が表示されるか
 *  - 予算 0（未入力）のときに ¥0 を出さないか
 *  - 2つの操作（onPress / onDelete）が正しく撃ち分けられるか
 */
describe('MenuCard (molecule)', () => {
  it('料理名と予算を表示する', () => {
    render(<MenuCard menu={menu()} onPress={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('カレー')).toBeTruthy();
    expect(screen.getByText('¥800')).toBeTruthy();
  });

  it('材料は先頭3件までで、続きがあれば省略記号を添える', () => {
    render(<MenuCard menu={menu()} onPress={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/肉、玉ねぎ、じゃがいも/)).toBeTruthy();
    expect(screen.queryByText(/にんじん/)).toBeNull();
  });

  it('予算が 0（未入力）なら金額を表示しない', () => {
    render(<MenuCard menu={menu({ budget: 0 })} onPress={() => {}} onDelete={() => {}} />);
    expect(screen.queryByText('¥0')).toBeNull();
  });

  it('カード本体のタップで onPress が呼ばれる', () => {
    const onPress = jest.fn();
    const onDelete = jest.fn();
    render(<MenuCard menu={menu()} onPress={onPress} onDelete={onDelete} testID="card" />);
    fireEvent.press(screen.getByTestId('card'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('削除アイコンのタップで onDelete だけが呼ばれる', () => {
    const onPress = jest.fn();
    const onDelete = jest.fn();
    render(<MenuCard menu={menu()} onPress={onPress} onDelete={onDelete} testID="card" />);
    fireEvent.press(screen.getByTestId('card-delete'));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('compact では材料を省く（狭い列でも料理名が読めるように）', () => {
    render(<MenuCard menu={menu()} onPress={() => {}} onDelete={() => {}} compact />);
    expect(screen.getByText('カレー')).toBeTruthy();
    expect(screen.queryByText(/玉ねぎ/)).toBeNull();
  });
});
