/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { QuickAddMenuInput } from './QuickAddMenuInput';

/**
 * molecule のテスト観点:
 *  - 入力 → 追加で、trim 済みの値が onSubmit に渡るか
 *  - 空入力を弾き、エラーを出すか（＝空の献立が保存されない）
 *  - 追加後に入力欄が空に戻るか（連続入力できるか）
 */
describe('QuickAddMenuInput (molecule)', () => {
  it('入力して追加すると onSubmit に料理名が渡る', () => {
    const onSubmit = jest.fn();
    render(<QuickAddMenuInput onSubmit={onSubmit} testID="quick" />);
    fireEvent.changeText(screen.getByTestId('quick'), 'カレー');
    fireEvent.press(screen.getByTestId('quick-submit'));
    expect(onSubmit).toHaveBeenCalledWith('カレー');
  });

  it('前後の空白は落として渡す', () => {
    const onSubmit = jest.fn();
    render(<QuickAddMenuInput onSubmit={onSubmit} testID="quick" />);
    fireEvent.changeText(screen.getByTestId('quick'), '  肉じゃが  ');
    fireEvent.press(screen.getByTestId('quick-submit'));
    expect(onSubmit).toHaveBeenCalledWith('肉じゃが');
  });

  it('キーボードの完了（onSubmitEditing）でも追加できる', () => {
    const onSubmit = jest.fn();
    render(<QuickAddMenuInput onSubmit={onSubmit} testID="quick" />);
    const input = screen.getByTestId('quick');
    fireEvent.changeText(input, '味噌汁');
    fireEvent(input, 'submitEditing');
    expect(onSubmit).toHaveBeenCalledWith('味噌汁');
  });

  it('空のまま追加しても onSubmit は呼ばれず、エラーを出す', () => {
    const onSubmit = jest.fn();
    render(<QuickAddMenuInput onSubmit={onSubmit} testID="quick" />);
    fireEvent.press(screen.getByTestId('quick-submit'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('料理名を入力してください')).toBeTruthy();
  });

  it('空白のみもエラーにする', () => {
    const onSubmit = jest.fn();
    render(<QuickAddMenuInput onSubmit={onSubmit} testID="quick" />);
    fireEvent.changeText(screen.getByTestId('quick'), '   ');
    fireEvent.press(screen.getByTestId('quick-submit'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('料理名を入力してください')).toBeTruthy();
  });

  it('入力を再開するとエラー表示が消える', () => {
    render(<QuickAddMenuInput onSubmit={() => {}} testID="quick" />);
    fireEvent.press(screen.getByTestId('quick-submit'));
    expect(screen.getByText('料理名を入力してください')).toBeTruthy();
    fireEvent.changeText(screen.getByTestId('quick'), 'カ');
    expect(screen.queryByText('料理名を入力してください')).toBeNull();
  });

  it('追加後は入力欄が空に戻り、続けて登録できる', () => {
    const onSubmit = jest.fn();
    render(<QuickAddMenuInput onSubmit={onSubmit} testID="quick" />);
    const input = screen.getByTestId('quick');
    fireEvent.changeText(input, 'カレー');
    fireEvent.press(screen.getByTestId('quick-submit'));
    expect(input.props.value).toBe('');

    fireEvent.changeText(input, 'サラダ');
    fireEvent.press(screen.getByTestId('quick-submit'));
    expect(onSubmit).toHaveBeenNthCalledWith(2, 'サラダ');
  });
});
