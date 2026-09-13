/// <reference types="jest" />

import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { MenuViewModeTabs } from './MenuViewModeTabs';

describe('MenuViewModeTabs (molecule)', () => {
  it('両方のタブを表示する', () => {
    render(<MenuViewModeTabs value="day" onChange={() => {}} />);
    expect(screen.getByText('日別')).toBeTruthy();
    expect(screen.getByText('週別')).toBeTruthy();
  });

  it('選択状態が accessibilityState.selected に反映される', () => {
    render(<MenuViewModeTabs value="week" onChange={() => {}} testID="tabs" />);
    expect(screen.getByTestId('tabs-week').props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(screen.getByTestId('tabs-day').props.accessibilityState).toMatchObject({
      selected: false,
    });
  });

  it('未選択のタブを押すと onChange が呼ばれる', () => {
    const onChange = jest.fn();
    render(<MenuViewModeTabs value="day" onChange={onChange} testID="tabs" />);
    fireEvent.press(screen.getByTestId('tabs-week'));
    expect(onChange).toHaveBeenCalledWith('week');
  });
});
