/// <reference types="jest" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { UserFilterButton } from './UserFilterButton';

/**
 * molecule のテスト観点:
 *  - props(name) が表示されるか
 *  - 状態(isVisible) がアクセシビリティ/見た目に反映されるか
 *  - 操作(onPress) が発火するか
 */
describe('UserFilterButton (molecule)', () => {
  it('名前を表示する', () => {
    render(<UserFilterButton name="パパ" isVisible onPress={() => {}} />);
    expect(screen.getByText('パパ')).toBeTruthy();
  });

  it('タップすると onPress が呼ばれる', () => {
    const onPress = jest.fn();
    render(<UserFilterButton name="ママ" isVisible onPress={onPress} testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('isVisible が accessibilityState.selected に反映される', () => {
    render(<UserFilterButton name="太郎" isVisible={false} onPress={() => {}} testID="btn" />);
    expect(screen.getByTestId('btn').props.accessibilityState).toMatchObject({
      selected: false,
    });
  });
});