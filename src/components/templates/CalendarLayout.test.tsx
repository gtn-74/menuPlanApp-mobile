/// <reference types="jest" />

import { render, screen } from '@testing-library/react-native';
import type React from 'react';
import { Text } from 'react-native';
import { CalendarLayout } from './CalendarLayout';

/**
 * template のテスト観点:
 *  - 各 slot が対応する領域に描画されるか（＝配置の器として機能するか）
 *  - 状態を持たないので、渡した ReactNode がそのまま出ることだけ確認すればよい
 * page と違い store/navigation を結線しないので、単純な slot を渡して構造を見る。
 */
describe('CalendarLayout (template)', () => {
  const setup = (sheet?: React.ReactNode) =>
    render(
      <CalendarLayout
        header={<Text>ヘッダー</Text>}
        calendar={<Text>カレンダー</Text>}
        userFilter={<Text>フィルタ</Text>}
        sheet={sheet}
      />,
    );

  it('header / calendar / userFilter の各 slot を描画する', () => {
    setup();
    expect(screen.getByText('ヘッダー')).toBeTruthy();
    expect(screen.getByText('カレンダー')).toBeTruthy();
    expect(screen.getByText('フィルタ')).toBeTruthy();
  });

  it('各 slot が対応する領域(region)の中に入る', () => {
    setup();
    const headerRegion = screen.getByTestId('region-header');
    // region-header の子孫として「ヘッダー」テキストが存在する
    expect(headerRegion).toContainElement(screen.getByText('ヘッダー'));

    const calendarRegion = screen.getByTestId('region-calendar');
    expect(calendarRegion).toContainElement(screen.getByText('カレンダー'));
  });

  it('sheet slot は任意（未指定でも落ちない）', () => {
    setup();
    expect(screen.queryByText('シート')).toBeNull();
  });

  it('sheet を渡すと描画される', () => {
    setup(<Text>シート</Text>);
    expect(screen.getByText('シート')).toBeTruthy();
  });
});
