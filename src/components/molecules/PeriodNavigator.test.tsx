/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { PeriodNavigator } from './PeriodNavigator';

const setup = (overrides: Partial<React.ComponentProps<typeof PeriodNavigator>> = {}) => {
  const props = {
    label: '1月5日（月）',
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onReset: jest.fn(),
    resetLabel: '今日',
    ...overrides,
  };
  render(<PeriodNavigator {...props} testID="nav" />);
  return props;
};

describe('PeriodNavigator (molecule)', () => {
  it('期間ラベルとリセット文言を表示する', () => {
    setup();
    expect(screen.getByText('1月5日（月）')).toBeTruthy();
    expect(screen.getByText('今日')).toBeTruthy();
  });

  it('前へ/次へがそれぞれのハンドラを呼ぶ', () => {
    const { onPrev, onNext } = setup();
    fireEvent.press(screen.getByTestId('nav-prev'));
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId('nav-next'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('リセットボタンで onReset が呼ばれる', () => {
    const { onReset } = setup();
    fireEvent.press(screen.getByTestId('nav-reset'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('resetDisabled のときは押しても呼ばれない', () => {
    const { onReset } = setup({ resetDisabled: true });
    fireEvent.press(screen.getByTestId('nav-reset'));
    expect(onReset).not.toHaveBeenCalled();
  });
});
