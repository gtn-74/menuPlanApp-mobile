/// <reference types="jest" />
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DayScheduleList } from './DayScheduleList';
import type { DayData } from '../../types';

// 空の1日ぶんデータ。テストごとに必要なセクションだけ足す。
const emptyDay = (date = '2026-01-05'): DayData => ({
  date, menus: [], budgets: [], events: [], todos: [],
});

/**
 * organism のテスト観点:
 *  - データの有無でセクションが出し分けられるか（空状態 / 各セクション）
 *  - 子（予定/献立/Todo）に渡した値が表示されるか
 *  - hideHeader の分岐
 * データは props で注入するので store/API のモックは不要 = 描画に集中できる。
 */
describe('DayScheduleList (organism)', () => {
  it('データが無いとき空状態メッセージを出す', () => {
    render(<DayScheduleList data={emptyDay()} />);
    expect(screen.getByText('予定・献立はありません')).toBeTruthy();
  });

  it('予定があると「予定」セクションと内容を表示する', () => {
    const data = emptyDay();
    data.events = [
      { id: 'e1', date: data.date, title: '歯医者', time: '10:00', type: 'personal', userId: 'user-1', createdAt: '' },
    ];
    render(<DayScheduleList data={data} />);
    expect(screen.getByText('予定')).toBeTruthy();
    expect(screen.getByText('歯医者')).toBeTruthy();
    expect(screen.getByText('10:00')).toBeTruthy();
    // 予定がある＝空状態は出ない
    expect(screen.queryByText('予定・献立はありません')).toBeNull();
  });

  it('献立の材料は先頭3つ＋省略記号で表示する', () => {
    const data = emptyDay();
    data.menus = [
      { id: 'm1', date: data.date, name: 'カレー', budget: 800,
        ingredients: ['肉', '玉ねぎ', 'にんじん', 'じゃがいも'], photos: [],
        userId: 'user-1', familyGroupId: 'f', createdAt: '' },
    ];
    render(<DayScheduleList data={data} />);
    expect(screen.getByText('カレー')).toBeTruthy();
    expect(screen.getByText('肉、玉ねぎ、にんじん...')).toBeTruthy();
  });

  it('Todo の担当者IDは名前に解決して表示する', () => {
    const data = emptyDay();
    data.todos = [
      { id: 't1', date: data.date, title: '買い物', completed: false,
        priority: 'high', userId: 'user-1', assignedTo: 'user-2', createdAt: '' },
    ];
    render(<DayScheduleList data={data} />);
    expect(screen.getByText('買い物')).toBeTruthy();
    expect(screen.getByText('ママ')).toBeTruthy(); // user-2 → ママ
    expect(screen.getByText('高')).toBeTruthy(); // priority high ラベル
  });

  it('hideHeader=false のとき日付ヘッダーを整形表示する', () => {
    render(<DayScheduleList data={emptyDay('2026-01-05')} hideHeader={false} />);
    expect(screen.getByText('1月5日（月）')).toBeTruthy();
  });
});